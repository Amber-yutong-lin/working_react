
import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import './Page3.css';
import Draggable from 'react-draggable';
import {tempAlbumList} from "./Page2"
let tempUploadList =[];
class Page3 extends Component {
    constructor(props){
        super(props);
        this.state= {
            imgUrlValue:"",
            curImgId:"",
            curId:"",
            uploadList: tempUploadList,
            isDrag:false,
            titleName:""
        }
    }
    componentWillUnmount(){
        let {uploadList} = this.state;
        tempUploadList =uploadList;
    }
    componentWillMount(){
        let {id} = this.props.match.params;
        let {uploadList} = this.state;
        let isExist=uploadList.some((item)=>{
            return item.id === id;
        });
        console.log(tempAlbumList)
        tempAlbumList.forEach((item)=>{
            if(item.id == id){
                this.setState({
                    titleName:item.name
                })
            }
        });
        if(!isExist){
            uploadList.push({
                id:id,
                list:[
                    {imgId:1,imgUrl:"",x:0,y:0,zIndex:0},
                    {imgId:2,imgUrl:"",x:0,y:0,zIndex:1},
                    {imgId:3,imgUrl:"",x:0,y:0,zIndex:2},
                    {imgId:4,imgUrl:"",x:0,y:0,zIndex:3}

                ]
            });
            this.setState({
                uploadList:uploadList
            })
        }
    }
    getCurUploadList(){
        let {id} = this.props.match.params;
        let {uploadList} = this.state;
        let curList = uploadList.filter((item,i)=>{
            return item.id === id;
        });
        if(curList.length >0){
            return curList[0]
        }else{
            return {}
        }
    }
    handleChangeFile(id,imgId){
        let uploadImg = this.refs.uploadImg;
        this.setState({
            curImgId:imgId,
            curId:id
        },function () {
            uploadImg.click();
        });
    }
    onChangeUpload(e){
        let freader = new FileReader();
        let ofile = e.target.files[0];
        let self = this;
        let {
            curImgId,
            curId,
            uploadList
        }= this.state;
        if (ofile) {
            freader.readAsDataURL(ofile);
            freader.onload = function() {

                for(let i=0;i<uploadList.length;i++){
                    if(uploadList[i].id === curId ){
                        let list = uploadList[i].list;
                        for(let l= 0;l<list.length;l++){
                            if(list[l].imgId === curImgId){
                                list[l].imgUrl = this.result;
                                uploadList[i].list =list;
                                break;
                            }
                        }
                        break;
                    }
                }
                self.setState({
                    imgUrlValue:"",
                    uploadList:uploadList
                })
            };
        }
    }
    handleStop(e,data){

        console.log(data)
        this.handleDraggableFn({state:1,dataId:this.children.props['data-id'],DraggableData:data})
    }
    handleDrag(){

    }
    handleStart(){
        this.handleDraggableFn({state:0,ref:this.children.ref});
    }
    handleDraggableFn(data){
        let {state,DraggableData, dataId} = data;

        if(state === 0){
            this.refs[data.ref].style.zIndex =1000;
            this.setState({
                isDrag:true
            });
        }else{
            let {id} = this.props.match.params;
            let {uploadList} = this.state;
            let curList = uploadList.filter((item,i)=>{
                return item.id === id;
            });
            let sortArr =[];
            sortArr = curList[0].list.slice(0);
            sortArr = sortArr.sort(function (a,b) {
                return a.zIndex > b.zIndex;
            });
            let dataIndex = 0;
            sortArr.forEach(function (item,i) {
               if(item.imgId === dataId){
                   item.zIndex = sortArr.length -1;
                   item.x = DraggableData.x;
                   item.y = DraggableData.y;
               }else{
                   item.zIndex = dataIndex;
                   dataIndex++;
               }
            });
            sortArr.sort(function (a,b) {
                return a.imgId > b.imgId;
            });
            uploadList.forEach((item,i)=>{
                if(item.id === id){
                    item.list = sortArr;
                    return;
                }
            });
            this.setState({
                isDrag:false,
                uploadList:uploadList
            });
        }
    }
    addImg(){
        let {id} = this.props.match.params;
        let {uploadList} = this.state;
        uploadList.forEach((item)=>{
            if(item.id === id){
                item.list.push({
                    imgId:item.list.length+1,
                    imgUrl:"",
                    x:0,
                    y:0,
                    zIndex:item.list.length
                })
            }
        });
        this.setState({
            uploadList:uploadList
        })
    }
    render() {
        let {imgUrlValue, titleName}= this.state;
        let curUpload = this.getCurUploadList();
        return (
            <div className="page3">
                <div className="container">
                    <div className="content">
                        <div className="p40 page3-inner">
                            <p className="page2-title">upload your polaroid to {titleName}</p>
                            <ul className="upload-list">
                                {
                                    curUpload.list.map((item,i)=>{
                                        return (<Draggable onStart={this.handleStart}
                                                           handleDraggableFn ={this.handleDraggableFn.bind(this)}
                                                           handle=".handle"
                                                           onDrag={this.handleDrag}
                                                           onStop={this.handleStop}
                                                           defaultPosition={{x:item.x, y: item.y}}
                                                            key={i}>
                                                    <li className="handle" ref={`draggable${i}`} data-id={item.imgId} style={{'zIndex':item.zIndex}}>
                                                        <div className="upload-list-inner">
                                                            <img onClick={this.handleChangeFile.bind(this,curUpload.id,item.imgId)}
                                                                 src={item.imgUrl}
                                                                 alt=""/>
                                                        </div>
                                                    </li>
                                        </Draggable>)
                                    })
                                }
                                <li onClick={this.addImg.bind(this)}>
                                    <div className="album-img">
                                        <div className="add-img"></div>
                                        <div className="add-text">New frame</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <input ref="uploadImg" value={imgUrlValue} onChange={this.onChangeUpload.bind(this)} type="file" className="hide"/>
                    <div className="footer">
                        <span className="footer-left fl">
                            <Link to="/page2">Back</Link> to create an album.
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}



export default Page3;
