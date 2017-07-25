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
    const { drawSomething, clearCanvas } = this.props;
    return (
      <div>
        <button type="button" onClick={drawSomething}>Context2Dに四角形を描画する</button>
        <button type="button" onClick={clearCanvas}>クリア</button><br/>
        <canvas id="myCanvas"></canvas>
      </div>
    );
  }
}

CanvasComponent.propTypes = {
  drawSomething: PropTypes.func.isRequired,
  clearCanvas: PropTypes.func.isRequired
};

class WebGLComponent extends React.Component {
  render() {
    const { drawSomething, clearMesh } = this.props;
    return (
      <div>
        <button type="button" onClick={drawSomething}>スタート</button>
        <button type="button" onClick={clearMesh}>クリア</button>
      </div>
    );
  }
}

WebGLComponent.propTypes = {
  drawSomething: PropTypes.func.isRequired,
  clearMesh: PropTypes.func.isRequired
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
      drawSomething() {
        const canvas = document.getElementById("myCanvas");
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "green";
        ctx.fillRect(10, 10, 100, 100);
      },
      clearCanvas() {
        const canvas = document.getElementById("myCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(10, 10, 100, 100);
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

    let THREE;
    let scene;
    let camera;
    let geometry;
    let material;
    let mesh;
    let renderer;
    let rendererDom;
    let request;
    const rootDom = document.querySelector('#root-webgl');

    return {
      drawSomething() {

        THREE = window.THREE;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

        geometry = new THREE.BoxGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xe60013, wireframe: true } );

        mesh = new THREE.Mesh( geometry, material );

        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( 400, 400 );

        rendererDom = renderer.domElement;
        rootDom.appendChild( rendererDom );

        const animate = () => {
          request = requestAnimationFrame( animate );

          mesh.rotation.x += 0.01;
          mesh.rotation.y += 0.02;

          renderer.render( scene, camera );
        }

        animate();
      },
      clearMesh() {

        scene.remove( mesh );
        geometry.dispose();
        material.dispose();
        rootDom.removeChild( rendererDom );
        rendererDom = null;
        cancelAnimationFrame(request)

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

