// (original from: https://gist.github.com/shimizu/fde15aa8cf734f1219f8)

import * as d3 from 'd3'
import * as moment from 'moment'
import * as React from 'react';
import * as LandmassesGeojson from './LandmassesGeojson'

export interface Props{
}

export interface State{
}

class WorldClock extends React.Component<Props, State> {
  constructor(props){
    super(props)
    this.create = this.create.bind(this)
  }

  componentDidMount() {
    this.create()
  }
  componentDidUpdate() {
    this.create()
  }

  create() {
    const _self = this;
    const node = (this as any).node;

    const windowWidth  = 960;
    const windowHeight = 500;

    node.style.width  = windowWidth;
    node.style.height = windowHeight;
          
    const svg = d3.select(node);
       
    const projection90 = d3.geo.orthographic() 
      .scale(windowWidth/4)	
      .rotate([0,0,0])	
      .translate([windowWidth / 2, windowHeight / 2])
      .clipAngle(90);	
      
    const projection180 = d3.geo.orthographic() 
      .scale(windowWidth/4)	
      .rotate([0,0,0])	
      .translate([windowWidth / 2, windowHeight / 2])
      .clipAngle(180);
        

    const geojson = LandmassesGeojson.geojson;
 
     /*************************************************************
     * 地球儀表示
     *************************************************************/	
    const stage = svg.append("svg:g"); 
    
    //ステージを右23.4度傾ける
    stage.attr("transform", `rotate(23.4, ${+windowWidth/2}, ${windowHeight/2})`);
    

    //地形(裏)
    const backMap = stage.append("svg:path")
      .attr({
        "fill-opacity":1,
        "fill":"#EDE9F1",
        "stroke":"none",
      });

    //地形(表)
    const frontMap = stage.append("svg:path")
      .attr({
        "fill-opacity":1,
        "fill":"#FD81DB",
        "stroke":"none",
      });
      
  
    //地形を回転させる
    (()=>{
      let i = 0;
      (function update(){
        i = i+0.2;
        projection90.rotate([i,0,0]);  
        projection180.rotate([i,0,0]);  

        const frontPath = d3.geo.path().projection(projection90);
        const backPath  = d3.geo.path().projection(projection180);

        backMap.attr("d", backPath(geojson)); 
        frontMap.attr("d", frontPath(geojson));

        setTimeout(update, 100);
      })();
    })();
    
    
    /*************************************************************
     * 時計表示
     *************************************************************/
    const marginLeft = windowWidth/7;
    const marginTop  = windowHeight/3 + windowHeight/12;
    const textY = 8;
    
    const clockGroup = svg.append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);
      
    
    //テキスト背景描画
    const clockRect = clockGroup.append("rect")
      .attr({
        "width":"70%",
        "height":windowWidth/10,
        "fill":"EDE9F1",
        "fill-opacity": 0.2
      })
    
    //テキスト描画
    const clockText = clockGroup.append("text")
      .attr({
        "x":"10",
        "y":windowWidth/11,
        "font-size": 110,
        "font-weight":"bold",
        "font-family":"arial",
        "line-height": 1.5,
        "letter-spacing": 5,
        "word-spacing": 5
      });
      
    //テキスト更新
    setInterval(() => {
      clockText.text(moment().format('HH:mm:ss:SS'));	
    }, 1)
  }

  render() {
    return <svg ref={node => (this as any).node = node}></svg>
  }
}

export default WorldClock
