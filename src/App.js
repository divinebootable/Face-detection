import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import  Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
 apiKey: '63548a53000e4d7ba5e35c4a4acb66df'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component{
   constructor(){
     super();
     this.state = {
       input:'',
       imageUrl:'',
       box:{},
       route:'signin'
     }
   }
   calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

   displayFaceBox = (box) => {
     console.log(box);
    this.setState({box: box});
  }
   onInputChange = (event)=>{
     this.setState({input: event.target.value});
   }
   onButtonSubmit = () => {
     this.setState({imageUrl: this.state.input});
     app.models
     .predict(
         Clarifai.FACE_DETECT_MODEL,
        this.state.input)
        .then(response =>this.displayFaceBox(this.calculateFaceLocation(response)))
       // do something with response
        .catch(err => console.log(err));
       // there was an error
     }
     onRouteChange = (route)=>{
       this.setState({route:route})
     }
  render() {
    return (
      <div className="App">
        <Particles className='particles'
            params={particlesOptions}
          />
        <Navigation onRouteChange={this.onRouteChange}/>
        {
          this.state.route === 'home'
          ? <div>
                <Logo/>
                <Rank/>
                <ImageLinkForm
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                />
               <FaceRecognition box={this.state.box}  imageUrl={this.state.imageUrl}/>
       </div>
       :(
         this.state.route === 'signin'
         ? <Signin onRouteChange={this.onRouteChange} />
         : <Register onRouteChange={this.onRouteChange} />
       )


     }
      </div>
    );
  }
}

export default App;
