// (from: https://gist.github.com/shimizu/fde15aa8cf734f1219f8)

import * as d3 from 'd3'
import moment from 'moment'
import React, { Component } from 'react'

class WorldClock extends Component {
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
    const node = this.node;


    var windowWidht = 960;
    var windowHeight = 500;

    node.style.width = windowWidht;
    node.style.height = windowHeight;
          
    var svg = d3.select(node);
       
    var projection90 = d3.geo.orthographic() 
      .scale(windowWidht/4)	
      .rotate([0,0,0])	
      .translate([windowWidht / 2, windowHeight / 2])
      .clipAngle(90);	
      
    var projection180 = d3.geo.orthographic() 
      .scale(windowWidht/4)	
      .rotate([0,0,0])	
      .translate([windowWidht / 2, windowHeight / 2])
      .clipAngle(180);	
        
      
    var frontPath = d3.geo.path().projection(projection90);
    var backPath = d3.geo.path().projection(projection180);
        
      d3.json("https://gist.githubusercontent.com/shimizu/97c156f7f9137586f784/raw/4be1053346fa88d448c2290c49689634c8102b0a/Landmasses.geojson", function(geojson){ 
        
        
        /*************************************************************
         * 地球儀表示
         *************************************************************/	
        var stage = svg.append("svg:g"); 
        
        //ステージを右23.4度傾ける
        stage.attr("transform", "rotate(23.4, "+windowWidht/2+",  "+windowHeight/2+")") ;
    
        //地形(裏)
        var backMap = stage.append("svg:path")
          .attr({
          "d":function(){ return backPath(geojson)},
            "fill-opacity":1,
            "fill":"#EDE9F1",
            "stroke":"none",
          });
    
        //地形(表)
        var frontMap = stage.append("svg:path")
          .attr({
          "d":function(){ return frontPath(geojson)},
            "fill-opacity":1,
            "fill":"#FD81DB",
            "stroke":"none",
          });
          
     
        //地形を回転させる
        var update = function(){
          var i = 0;
          return function(){
            i = i+0.2;
            projection90.rotate([i,0,0]);  
            projection180.rotate([i,0,0]);  
    
            frontPath = d3.geo.path().projection(projection90);
            backPath = d3.geo.path().projection(projection180);
    
            backMap.attr("d", backPath(geojson)); 
            frontMap.attr("d", frontPath(geojson)); 
            
          }
        }		
        setInterval(update(), 100); 
        
        
        /*************************************************************
         * 時計表示
         *************************************************************/
        var marginLeft = windowWidht/7;
        var marginTop = windowHeight/3 + windowHeight/12;
        var textY = 8;
        
        
        var clockGroup = svg.append("g")
          .attr("transform", "translate("+[marginLeft, marginTop]+")") ;
        
        //テキスト背景描画
        var clockRect = clockGroup.append("rect")
          .attr({
            "width":"70%",
            "height":windowWidht/10,
            "fill":"EDE9F1",
            "fill-opacity": 0.2
          })
        
        //テキスト描画
        var clockText = clockGroup.append("text")
          .attr({
            "x":"10",
            "y":windowWidht/11,
            "font-size": 110,
            "font-weight":"bold",
            "font-family":"arial",
            "line-height": 1.5,
            "letter-spacing": 5,
            "word-spacing": 5
          });
          
        //テキスト更新
        setInterval(function(){
          clockText.text(moment().format('HH:mm:ss:SS'));	
        }, 1)
    });
  }

  render() {
    return <svg ref={node => this.node = node}>
    </svg>
  }
}

export default WorldClock
