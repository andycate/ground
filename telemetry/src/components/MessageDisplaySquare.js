import React, {
  Component,
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { Button, Card, CardContent, ClickAwayListener, Grow, Paper, Popper } from "@material-ui/core";
import { withStyles, withTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import comms from "../api/Comms";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";
import moment from "moment";
import { useWindowSize } from "./useWindowSize";

const styles = _ => ({
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
    background: 'white'
  },
  floatingButton: {
    position: 'absolute',
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
  }
});

export const LogMessageContext = createContext({});

const LogMessage = ({ log, index, classes }) => {
  const { ts, _k, _val } = log;
  const { setSize, windowWidth } = useContext(LogMessageContext);
  const root = useRef();

  const paddedIndex = index.toString().padStart(5, "0")

  useEffect(() => {
    setSize(index, root.current.getBoundingClientRect().height);
  }, [windowWidth]);

  return (
    <div ref={root} className={classes.logLine} title={`${moment(ts).fromNow(false)}`}>
      <span className={classes.logLineIdx}>
        [{paddedIndex}]
      </span>
      <span className={classes.logLineTime}>
        {moment(ts).format("hh:mm:ss.SSS")}
      </span>
      <div className={classes.logLineMessage}>
        {_k} -> {_val}
      </div>
    </div>
  );
};

const LogMessageHistory = ({ listRef, logs, classes }) => {
  const filterMenuButton = useRef(null);

  const sizeMap = useRef({});
  const setSize = useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
  }, []);
  const getSize = useCallback(index => sizeMap.current[index] || 20, []);

  const [openFilterMenu, setOpenFilterMenu] = useState(false)
  const [windowWidth] = useWindowSize();

  return (
    <LogMessageContext.Provider value={{ setSize, windowWidth }}>
      <Box height={'100%'}>
        <Box position={'relative'}>
          <Box position={'absolute'} top={0} left={0} right={0} display={'flex'} flexDirection={'row'}
            justifyContent={'space-between'} zIndex={19} className={classes.floatingBackBoard} mr={3}>
            <div>Event Logs</div>
            <Box position={'relative'}>
              <Button
                variant={'contained'}
                color={'primary'}
                size={'small'}
                className={classes.floatingButton}
                ref={filterMenuButton}
                onClick={() => setOpenFilterMenu(true)}
              >
                Filter Logs
              </Button>
              <Popper open={openFilterMenu}
                anchorEl={filterMenuButton.current} role={undefined}
                transition disablePortal
                className={classes.floatingMenu}
                placement={'bottom-end'}
              >
                {({ TransitionProps, _ }) => (
                  <Grow {...TransitionProps}>
                    <Paper>
                      <ClickAwayListener onClickAway={() => setOpenFilterMenu(false)}>
                        <Box>
                          hihi menu
                        </Box>
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
      logs: [],
      pauseAutoScroll: false
    }

    this.listRef = createRef()
    this.rowHeights = createRef()

    this.wheelListener = createRef()

    this.handleUpdate = this.handleUpdate.bind(this)
    this.getRowHeight = this.getRowHeight.bind(this)
    this.setRowHeight = this.setRowHeight.bind(this)
  }

  handleUpdate(timestamp, update) {
    const { logs } = this.state

    // if (logs.length > 50) return

    logs.push(...Object.keys(update).map(_k => ({ ts: timestamp, _k, _val: update[_k] })))
    this.setState({
      logs
    }, () => {
      this.recalculateElHeights()
      this.scrollToBottom()
    })
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
      listNode.addEventListener('wheel', this.wheelListener.current)
    }
  }

  getRowHeight(index) {
    if (this.rowHeights.current && typeof this.rowHeights.current[index] === 'number') {
      return this.rowHeights.current[index]
    }

    return 20
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

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <LogMessageHistory classes={classes} listRef={this.listRef} logs={this.state.logs}/>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(MessageDisplaySquare));
