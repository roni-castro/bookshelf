import React from 'react'
import {client} from 'utils/api-client'

let queue = []
setInterval(sendProfilerLogToApi, 5000)

function sendProfilerLogToApi() {
  if (!queue.length) {
    return Promise.resolve({success: true})
  }
  const queueToSend = [...queue]
  queue = []
  return client('profile', {data: queueToSend})
}

// this is for extra credit
function Profiler({metadata, phases, ...props}) {
  function onRenderCallback(
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions, // the Set of interactions belonging to this update
  ) {
    if (!phases || phases.includes(phase)) {
      const data = {
        metadata,
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      }
      queue.push(data)
    }
  }
  return <React.Profiler onRender={onRenderCallback} {...props} />
}

export default Profiler
