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
        <h4>(1) 四角形を描画する</h4>
        <button type="button" onClick={drawSomething}>Context2Dに四角形を描画する</button>
        <button type="button" onClick={clearCanvas}>クリア</button><br/>
        <canvas id="myCanvas" ></canvas>
      </div>
    );
  }
}

CanvasComponent.propTypes = {
  drawSomething: PropTypes.func.isRequired,
  clearCanvas: PropTypes.func.isRequired
};

class CanvasComponent2 extends React.Component {
  render() {
    const {
      changeColor,
      clearCanvas,
      startDrawing,
      drawLineWithMouse,
      stopDrawing
    } = this.props;
    return (
      <div>
        <h4>(2) マウスで線を描画する</h4>
        <p>マウスでクリックしながら線を書くことができます。</p>
        <button type="button" onClick={changeColor}>ペンの色を変える</button>
        <button type="button" onClick={clearCanvas}>クリア</button><br/>
        <canvas id="myCanvas2" onMouseDown={startDrawing} onMouseMove={drawLineWithMouse} onMouseUp={stopDrawing}></canvas>
      </div>
    );
  }
}

CanvasComponent2.propTypes = {
  changeColor: PropTypes.func.isRequired,
  clearCanvas: PropTypes.func.isRequired,
  startDrawing: PropTypes.func.isRequired,
  drawLineWithMouse: PropTypes.func.isRequired,
  stopDrawing: PropTypes.func.isRequired
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

const CanvasContainer2 = (() => {

  const mapStateToProps = (/*state, ownProps*/) => {
    return {};
  }

  const mapDispatchToProps = (/*dispatch, ownProps*/) => {

    let startX = null, startY = null;
    let strokeStyle = '#2383BF';
    let mousePushing = false;

    return {
      changeColor() {
        const colors = ['#ff003b', '#2383BF', '#38c700', '#ffc814', '#ff14dc', '#000', '#8a8a8a'];
        strokeStyle = colors[Math.floor(Math.random() * colors.length)];

      },
      clearCanvas() {
        const myCanvas2 = document.getElementById("myCanvas2");
        const context = myCanvas2.getContext("2d");
        context.clearRect(0, 0, 300, 150);
        startX = null;
        startY = null;
      },
      startDrawing() {
        mousePushing = true;
      },
      drawLineWithMouse(event) {
        if (mousePushing === false) {
          return;
        }

        const myCanvas2 = document.getElementById("myCanvas2");
        const context = myCanvas2.getContext("2d");
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (startX === null) {
          startX = x;
          startY = y;
          return {};
        }

        context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = strokeStyle;
        context.moveTo(startX, startY);
        context.lineTo(x, y);
        context.stroke();
        startX = x;
        startY = y;
      },
      stopDrawing() {
        mousePushing = false;
        startX = null;
        startY = null;
      }
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(CanvasComponent2);

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
    <CanvasContainer2 />
  </Provider>,
  document.getElementById('root-canvas2')
)

render(
  <Provider store={store}>
    <WebGLContainer />
  </Provider>,
  document.getElementById('root-webgl')
)

