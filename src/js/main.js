/* global */
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js';
import 'babel-polyfill'

//import _ from 'lodash'
import React from 'react'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import PropTypes from 'prop-types'

//require('./three.min.js')

// index.html ファイルをコピーする
require('file-loader?name=../../dist/[name].[ext]!../index.html');

const logger = createLogger()

//-----------------------------------
// Action creators (Actionを返す)
//-----------------------------------

// 現段階では Action creators は使わないのでコメントアウトしておく
//const anAction = () => {
//  return {
//    type: '',
//  }
//}

//-----------------------------------
// Reducer
//-----------------------------------

const aState = (state = null/*, action*/) => {
  return state
}

//-----------------------------------
// Component
//-----------------------------------

class CanvasComponent extends React.Component {
  render() {
    const { startCode } = this.props;
    return (
      <div>
        <button type="button" onClick={startCode}>Context2Dに四角を描画する</button>
        <canvas id="myCanvas"></canvas>
      </div>
    );
  }
}

CanvasComponent.propTypes = {
  startCode: PropTypes.func.isRequired
};


class WebGLComponent extends React.Component {
  render() {
    const { startCode } = this.props;
    return (
      <div>
        <button type="button" onClick={startCode}>スタート</button>
      </div>
    );
  }
}

WebGLComponent.propTypes = {
  startCode: PropTypes.func.isRequired
};

//-----------------------------------
// Container
//-----------------------------------

const CanvasContainer = (() => {

  const mapStateToProps = (/*state, ownProps*/) => {
    return {};
  }
  
  const mapDispatchToProps = (/*dispatch*/) => {
    return {
      startCode() {
        const canvas = document.getElementById("myCanvas");
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "green";
        ctx.fillRect(10, 10, 100, 100);
      }
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(CanvasComponent);

})();

const WebGLContainer = (() => {

  const mapStateToProps = (/*state, ownProps*/) => {
    return {};
  }
  
  const mapDispatchToProps = (/*dispatch*/) => {
    return {
      startCode() {
        const THREE = window.THREE;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

        const geometry = new THREE.BoxGeometry( 200, 200, 200 );
        const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        const mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        //document.body.appendChild( renderer.domElement );
        document.querySelector('#root-webgl').appendChild( renderer.domElement );

        const animate = () => {
          requestAnimationFrame( animate );

          mesh.rotation.x += 0.01;
          mesh.rotation.y += 0.02;

          renderer.render( scene, camera );
        }

        animate();
      }
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(WebGLComponent);

})();

//-----------------------------------
// Store
//-----------------------------------

const store = (process.env.NODE_ENV === 'development')
  ? createStore(aState, applyMiddleware(logger))
  : createStore(aState);

//-----------------------------------
// 画面に表示する
//-----------------------------------

render(
  <Provider store={store}>
    <CanvasContainer />
  </Provider>,
  document.getElementById('root-canvas')
)

render(
  <Provider store={store}>
    <WebGLContainer />
  </Provider>,
  document.getElementById('root-webgl')
)

