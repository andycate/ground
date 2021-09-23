import React, {
  Component,
  createContext,
  createRef, forwardRef,
  useCallback,
  useContext,
  useEffect, useMemo,
  useRef,
  useState
} from "react";
import { Button, Card, CardContent, Checkbox, ClickAwayListener, Grow, Paper, Popper } from "@material-ui/core";
import { withStyles, withTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import comms from "../api/Comms";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import moment from "moment";
import { useWindowSize } from "./useWindowSize";
import clsx from "clsx";
import throttle from 'lodash.throttle';
import { GENERIC_FILTERS, ROOT_OPTION_GROUPING } from "../config/textbox-display-config";

const DEFAULT_ROW_HEIGHT = 22

const styles = style => ({
  root: {
    height: '100%'
  },
  cardContent: {
    height: '100%',
    padding: '8px',
    paddingBottom: '8px !important'
  },
  messagesContainer: {
    height: '100%',
    width: '100%'
  },
  floatingBackBoard: {
    background: style.palette.type === 'light' ?
      'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 80%, rgba(255,255,255,0.70453) 85%, rgba(255,255,255,0) 100%)' :
      `linear-gradient(180deg, ${style.palette.background.paper} 0%, ${style.palette.background.paper} 80%, ${style.palette.background.paper}B3 85%, ${style.palette.background.paper}00 100%)`,
    paddingBottom: 4
  },
  floatingButton: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    zIndex: 21,
    top: 0,
    right: 0,
    whiteSpace: 'nowrap'
  },
  floatingMenu: {
    zIndex: 20
  },
  item: {
    height: '50%',
    textAlign: 'center'
  },
  logLine: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  logLineIdx: {
    paddingRight: 4,
    fontSize: 13
  },
  logLineTime: {
    paddingRight: 12,
    fontSize: 13
  },
  logLineMessage: {
    fontSize: 15,
    paddingBottom: 1,
    wordBreak: 'break-word'
  },
  filterMenuSubItem: {
    paddingLeft: 24
  },
  filterMenuRoot: {
    whiteSpace: 'nowrap',
    padding: 8,
    marginLeft: -16,
    maxHeight: 240, // TODO: change this to be dynamic to the height of the text display box
    overflowY: 'auto'
  },
  filterMenuSubItemCheckBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export const LogMessageContext = createContext({});

const LogMessage = ({ log, index, classes }) => {
  const { ts, _k, _val, trueIdx, highlight } = log;
  const { setSize, windowWidth } = useContext(LogMessageContext);
  const root = useRef();

  const paddedIndex = trueIdx.toString().padStart(5, "0")

  useEffect(() => {
    setSize(index, root.current.clientHeight);
  }, [windowWidth]);

  return (
    <div ref={root} className={classes.logLine} title={`${moment(ts).fromNow(false)}`} {...highlight ? {
      style: {
        background: highlight
      }
    } : {}}>
      <span className={classes.logLineIdx}>
        [{paddedIndex}]
      </span>
      <span className={classes.logLineTime}>
        {moment(ts).format("hh:mm:ss.SSS")}
      </span>
      <div className={classes.logLineMessage}>
        {_k} -> {_val.toString()}
      </div>
    </div>
  );
};

const FilterItem = ({ node, classes, parentHighlight }) => {
  const { toggleOptionRootNode } = useContext(LogMessageContext)
  const { name, children, key, included = false, highlight: _highlight, ignored = false } = node

  // prioritize lowest subitem's highlight preference first
  const highlight = _highlight || parentHighlight

  if (ignored) {
    return <></>
  }

  return (
    <div className={classes.filterMenuSubItem}>
      <div className={classes.filterMenuSubItemCheckBox} {...highlight ? {
        style: {
          background: highlight
        }
      } : {}}>
        <Checkbox
          checked={included}
          onChange={(evt) => toggleOptionRootNode(key, evt.target.checked)}
          style={{
            padding: 0
          }}
        /> {name || key}
      </div>
      {(children || []).map(_node =>
        <FilterItem key={`filter - ${key} -> ${(_node.key)}`} node={{ ..._node, included: included || _node.included }}
          classes={classes} parentHighlight={highlight}/>
      )}
    </div>
  )
}

const FilterMenu = forwardRef((props, ref) => {

  const { optionGroupState } = useContext(LogMessageContext)
  const { classes } = props

  return (
    <div ref={ref} className={classes.filterMenuRoot}>
      <FilterItem classes={classes} node={optionGroupState}/>
    </div>
  )
})

const LogMessageHistory = ({ listRef, logs: _logs, classes, deleteLogs }) => {
  const filterMenuButton = useRef(null);

  const sizeMap = useRef({});

  const [openFilterMenu, setOpenFilterMenu] = useState(false)
  const [optionGroupState, _setOptionGroupState] = useState(ROOT_OPTION_GROUPING)
  const [numFiltersApplied, setNumFiltersApplied] = useState(0)
  const [numFiltersAvailable, setNumFiltersAvailable] = useState(0)

  const [windowWidth] = useWindowSize();

  const _flatGroupState = JSON.stringify(optionGroupState)

  const dfs = useCallback((node, cb) => {
    cb(node)
    for (let i = 0; i < (node.children || []).length; i++) {
      if (dfs(node.children[i], cb)) {
        break
      }
    }
  }, [_flatGroupState])

  const findPath = useCallback((node, predicate) => {
    if (predicate(node)) {
      return [node]
    }
    let arr = [];
    (node.children || []).forEach(_node => {
      const result = findPath(_node, predicate)
      if (result.length > 0) {
        arr = [node, ...result]
      }
    })
    return arr
  }, [_flatGroupState])

  const toggleOptionRootNode = useCallback((key, to) => {
    if (to === true) {
      // go downwards and turn all sub nodes on
      dfs(optionGroupState, (node) => {
        if (node.key === key) {
          dfs(node, (_node) => {
            _node.included = true
          })
          return true
        }
      })

      // find path to node, if any of the parent nodes now includes all children, turn parent node on
      const nodes = findPath(optionGroupState, (node) => node.key === key).reverse()
      for (let i = 1; i < nodes.length; i++) {
        const node = nodes[i]
        if ((node.children || []).reduce((acc, cur) => acc && cur.included, true)) {
          node.included = true
        }
      }

    } else {
      // find path to node and turn them all off, children nodes need to be turned off too
      const nodes = findPath(optionGroupState, (node) => node.key === key)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        node.included = false
        if (i === nodes.length - 1) {
          dfs(node, (_node) => {
            _node.included = false
          })
        }
      }
    }
    _setOptionGroupState(optionGroupState)
  }, [_flatGroupState])

  const setSize = useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
  }, []);
  const getSize = useCallback(index => sizeMap.current[index] || DEFAULT_ROW_HEIGHT, []);

  /**
   * sets filter to show all
   */
  useEffect(() => {
    toggleOptionRootNode(ROOT_OPTION_GROUPING.key, true)
  }, [])

  /**
   * clear size when filter changes
   */
  useEffect(() => {
    sizeMap.current = {}
  }, [_flatGroupState])

  /**
   * calculate the number of filters being used
   */
  useEffect(() => {
    let counter = 0
    let total = 0

    dfs(optionGroupState, (node) => {
      if ((node.children || []).length === 0) {
        if (!node.ignored) {
          total++
          if (node.included) {
            counter++
          }
        }
      } else {
        node.children = node.children.map(_n => ({
          ..._n,
          ignored: _n.ignored || node.ignored
        }))
      }
    })

    setNumFiltersApplied(counter)
    setNumFiltersAvailable(total)
  }, [_flatGroupState])

  /**
   * Parses filter tree to figure out what fields are allowed and find highlight colors for rows
   * @type {function(): [*[], *[], boolean, string, {}]}
   */
  const parseFilters = useCallback(() => {
    let allFields = []
    let allowedFields = []
    let includeUnknownFields = false
    let unknownHighlightColor = ''
    let highlights = {}

    dfs(optionGroupState, (node) => {
      if (node.key === 't2-unknowns' && node.included) {
        includeUnknownFields = true
        unknownHighlightColor = node.highlight
      }
      if ((node.children || []).length === 0) {
        if (node.included) {
          allowedFields.push(node.key)
        }
        allFields.push(node.key)
      }
    })

    allowedFields.forEach(key => {
      const path = findPath(optionGroupState, node => node.key === key).reverse() // start from back for specificity
      for (let i = 0; i < path.length; i++) {
        const node = path[i]
        if (node.highlight) {
          highlights[key] = node.highlight
          break
        }
      }
    })

    return [allFields, allowedFields, includeUnknownFields, unknownHighlightColor, highlights]
  }, [_flatGroupState])

  /**
   * filtered logs
   */
  const logs = useMemo(() => {
    const [allFields, allowedFields, includeUnknownFields, unknownHighlightColor, highlights] = parseFilters()

    return _logs
      .map((_l, idx) => {
        const allowedFieldsInclude = allowedFields.includes(_l._k)
        const anyFieldIncludes = allFields.includes(_l._k)
        return {
          ..._l,
          trueIdx: idx,
          included: allowedFieldsInclude || (includeUnknownFields && !anyFieldIncludes),
          highlight: !anyFieldIncludes ? unknownHighlightColor : highlights[_l._k]
        }
      })
      .filter(log => log.included)
  }, [_flatGroupState, _logs.length])

  return (
    <LogMessageContext.Provider value={{ setSize, windowWidth, optionGroupState, toggleOptionRootNode }}>
      <Box height={'100%'}>
        <Box position={'relative'}>
          <Box position={'absolute'} top={0} left={0} right={0} display={'flex'} flexDirection={'row'}
            justifyContent={'space-between'} zIndex={19} className={classes.floatingBackBoard} mr={3}>
            <div>Event Logs</div>
            <Box position={'relative'}>
              <Box className={classes.floatingButton}>
                <Button
                  variant={'contained'}
                  size={'small'}
                  onClick={() => deleteLogs()}
                  style={{
                    marginRight: 8
                  }}
                >
                  Delete All Logs
                </Button>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  size={'small'}
                  ref={filterMenuButton}
                  onClick={() => setOpenFilterMenu(true)}
                >
                  Filter Logs ({numFiltersApplied}/{numFiltersAvailable})
                </Button>
              </Box>
              <Popper open={openFilterMenu}
                anchorEl={filterMenuButton.current} role={undefined}
                transition disablePortal
                className={classes.floatingMenu}
                placement={'bottom-end'}
                modifiers={{
                  flip: {
                    enabled: false
                  },
                  preventOverflow: {
                    escapeWithReference: true
                  }
                }}
              >
                {({ TransitionProps, _ }) => (
                  <Grow {...TransitionProps}>
                    <Paper>
                      <ClickAwayListener onClickAway={() => setOpenFilterMenu(false)}>
                        <FilterMenu classes={classes}/>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>
          </Box>
        </Box>
        {logs.length > 0 && <AutoSizer className={classes.messagesContainer}>
          {({ height, width }) => (
            <List
              className="List"
              height={height - 12}
              width={width}
              itemCount={logs.length}
              itemSize={getSize}
              ref={listRef}>
              {({ index, style }) => (
                <div style={style}>
                  <LogMessage index={index} log={logs[index]} classes={classes}/>
                </div>
              )}
            </List>
          )}
        </AutoSizer>}
      </Box>
    </LogMessageContext.Provider>
  );
};

class MessageDisplaySquare
  extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: [{
        ts: 0,
        _k: 'filler',
        _val: 'initial'
      }],
      pauseAutoScroll: false,
      waiting: false
    }

    this.rawLogs = createRef()
    this.listRef = createRef()
    this.rowHeights = createRef()

    this.wheelListener = createRef()

    this.handleUpdate = this.handleUpdate.bind(this)
    this.getRowHeight = this.getRowHeight.bind(this)
    this.setRowHeight = this.setRowHeight.bind(this)
    this.deleteLogs = this.deleteLogs.bind(this)
    this.debouncedHandleUpdate = throttle(this._handleUpdate, 500)

    this._handleScroll = this._handleScroll.bind(this)
    this.debouncedHandleScroll = throttle(this._handleScroll, 200)
  }

  handleUpdate(timestamp, update) {
    const discardedFields = new Set()
    const nodes = [ROOT_OPTION_GROUPING]

    // figure out which fields should get ignored
    while (nodes.length > 0) {
      const node = nodes.shift()
      const ignored = node.ignored
      if (Array.isArray(node.children)) {
        const children = node.children.map(_n => ({
          ..._n,
          ignored: _n.ignored || ignored
        }))
        nodes.push(...children)
      } else {
        if (ignored) {
          discardedFields.add(node.key)
        } else {
          discardedFields.delete(node.key)
        }
      }
    }

    if (this.rawLogs.current) {
      this.rawLogs.current
        .push(...Object.keys(update)
          .filter(_k => !discardedFields.has(_k))
          .map(_k => ({
            ts: timestamp,
            _k,
            _val: update[_k]
          }))
          .filter(_o => GENERIC_FILTERS.reduce((acc, cur) => {
            return acc && !cur.ignoredIf(_o)
          }, true))
        )
    } else {
      this.rawLogs.current = this.state.logs
    }
    this.debouncedHandleUpdate()
  }

  _handleUpdate() {
    this.setState({
      logs: this.rawLogs.current
    }, () => {
      setTimeout(() => {
        this.recalculateElHeights()
        this.scrollToBottom()
      }, 0)
    })
  }

  _handleScroll(evt) {
    if (this.wheelListener?.current) {
      this.wheelListener.current(evt)
    }
  }

  componentDidMount() {
    comms.addUniversalSubscriber(this.handleUpdate);
  }

  componentWillUnmount() {
    comms.removeUniversalSubscriber(this.handleUpdate);
    this.listRef.current?._outerRef?.removeEventListener('wheel', this.wheelListener.current)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.listRef.current && !this.wheelListener.current) {
      const { _outerRef: listNode } = this.listRef.current
      this.wheelListener.current = (evt) => {
        if (evt.wheelDelta && evt.wheelDelta > 0 || evt.deltaY < 0) {
          this.setState({
            pauseAutoScroll: true
          })
        } else {
          if (listNode.scrollHeight - listNode.scrollTop - listNode.clientHeight <= 50) {
            this.setState({
              pauseAutoScroll: false
            })
          } else {
            this.recalculateElHeights()
          }
        }
      }
      listNode.addEventListener('wheel', this.debouncedHandleScroll)
    }
  }

  getRowHeight(index) {
    if (this.rowHeights.current && typeof this.rowHeights.current[index] === 'number') {
      return this.rowHeights.current[index]
    }

    return DEFAULT_ROW_HEIGHT
  }

  setRowHeight(index, size) {
    this.rowHeights.current = {
      ...this.rowHeights.current, [index]: size
    }
  }

  recalculateElHeights() {
    this.listRef.current?.resetAfterIndex(0)
  }

  scrollToBottom(forceScroll = false) {
    const { current } = this.listRef
    if (current) {
      if (this.state.pauseAutoScroll && !forceScroll) return
      current.scrollToItem(this.state.logs.length - 1, "end")
    }
  }

  deleteLogs(){
    if(Array.isArray(this.rawLogs.current)){
      this.rawLogs.current = []
    }

    this.rowHeights.current = {}

    this.debouncedHandleUpdate.cancel()
    this._handleUpdate()
    this.debouncedHandleScroll.cancel()

    this.setState({
      pauseAutoScroll: false
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <LogMessageHistory classes={classes} listRef={this.listRef} logs={this.state.logs} deleteLogs={this.deleteLogs}/>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(MessageDisplaySquare));
