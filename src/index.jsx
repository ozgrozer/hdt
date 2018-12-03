import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Rnd } from 'react-rnd'
import html2canvas from 'html2canvas'

import './style.scss'
import objectsList from './objectsList'

class App extends Component {
  constructor () {
    super()

    this.state = {
      objects: [
        { x: 399, y: 127, width: 118, zIndex: 1, name: 'headFrontAiry' },
        { x: 390, y: 273, width: 220, zIndex: 1, name: 'bottomStandingJogging' },
        { x: 427, y: 193, width: 156, zIndex: 1, name: 'bodyJacket' }
      ],
      objectsList
    }
  }

  addImage (opts) {
    const { objects } = this.state
    objects[objects.length] = { x: 10, y: 10, width: 100, name: opts.objectName }
    this.setState({ objects })
  }

  removeImage (opts) {
    const { objects } = this.state
    delete objects[opts.key]
    this.setState({ objects })
  }

  moveTo (opts) {
    const { objects } = this.state
    if (opts.direction === 'front') {
      objects[opts.key].zIndex = objects[opts.key].zIndex + 1
    } else if (opts.direction === 'back') {
      objects[opts.key].zIndex = objects[opts.key].zIndex - 1
    }
    this.setState({ objects })
  }

  saveImage () {
    html2canvas(document.getElementById('scene')).then(function (canvas) {
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/jpg').replace('image/jpg', 'image/octet-stream')
      a.download = 'humaaans.jpg'
      a.click()
    })
  }

  search (e) {
    const searchTerm = e.target.value

    let filteredResults = []

    if (searchTerm) {
      objectsList.map((object) => {
        if (object.toLowerCase().includes(searchTerm.toLowerCase())) {
          filteredResults.push(object)
        }
      })
    } else {
      filteredResults = objectsList
    }

    this.setState({
      objectsList: filteredResults
    })
  }

  render () {
    return (
      <div id='container'>
        <div id='objects'>
          <div id='searchWrapper'>
            <input type='text' id='search' placeholder='Search' onChange={this.search.bind(this)} />
          </div>

          <div id='list'>
            {
              this.state.objectsList.map((objectName, key) => {
                return (
                  <Fragment key={key}>
                    <img
                      alt={objectName}
                      title={objectName}
                      src={`objects/${objectName}.svg`}
                      onClick={this.addImage.bind(this, { objectName })} />
                    <br />
                  </Fragment>
                )
              })
            }
          </div>
        </div>

        <div id='scene'>
          {
            this.state.objects.map((object, key) => {
              return (
                <Rnd
                  key={key}
                  minWidth={10}
                  minHeight={10}
                  lockAspectRatio
                  style={{ zIndex: object.zIndex }}
                  default={{ x: object.x, y: object.y, width: object.width }}
                  >
                  <img src={`objects/${object.name}.svg`} alt={object.name} draggable='false' />

                  <div
                    title='Move to back'
                    className='moveToBack'
                    onClick={this.moveTo.bind(this, { direction: 'back', key })}
                    >
                    <img src='icons/arrowDown.svg' alt='' />
                  </div>
                  <div
                    title='Move to front'
                    className='moveToFront'
                    onClick={this.moveTo.bind(this, { direction: 'front', key })}
                    >
                    <img src='icons/arrowUp.svg' alt='' />
                  </div>
                  <div
                    title='Remove'
                    className='remove'
                    onClick={this.removeImage.bind(this, { key })}
                    >
                    <img src='icons/remove.svg' alt='' />
                  </div>
                </Rnd>
              )
            })
          }

          <button id='saveImage' onClick={this.saveImage.bind(this)}>Save</button>
        </div>

        <div id='footer1'>
          Click on the illustrations you want to add to the scene from the left side.
          <br />
          Move/resize/remove your illustrations to make your design.
          <br />
          Hit the save button to save your image.
        </div>

        <div id='footer2'>
          Source of this tool: <a href='https://github.com/ozgrozer/hdt' target='_blank'>github.com/ozgrozer/hdt</a>
          <br />
          Original illustrations: <a href='https://humaaans.com' target='_blank'>humaaans.com</a>
          <br />
          Me: <a href='https://twitter.com/ozgrozer' target='_blank'>twitter.com/ozgrozer</a>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
