import React, { Component } from "react";
import Auction from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";
import Web3 from 'web3';
import "./App.css";

class App extends Component {

  constructor(props) {
  super(props)
  this.state = {
    creator:'',
    contract:'',
    creator:'',
    account: '',
    name:"",
    PhNumber:"",
    minbid:'',
    minbidval:'',
    bid:'',
    winNum:'',
    currentbid:'',
    winName:'',
    winAddr:'',
    winValue:'',
    winAmount:'',
    currbid:false,
    result:false,
    startAuc:false,
    minAuc:false,
    len:'',
    checkResult:[],
    checkshow:{
      Name:'',
      phNumber:'',
      Addr:'',
      Amount:''
    },
    showWinResult:false,
    hideWinResult:false,
    showUserDetail:true,
    hideUserDetail:false,
    title:'',
    mainHeading:''
  }
  this.numChange = this.numChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.nameChange = this.nameChange.bind(this);
  this.startButton = this.startButton.bind(this);
  this.minButton = this.minButton.bind(this);
  this.minChange = this.minChange.bind(this);
  this.cancelButton = this.cancelButton.bind(this);
  this.endButton = this.endButton.bind(this);
  this.bidChange = this.bidChange.bind(this);
  this.bidSubmit = this.bidSubmit.bind(this);
  this.detailButton = this.detailButton.bind(this);
  this.hideButton = this.hideButton.bind(this);
  this.winDetailButton = this.winDetailButton.bind(this);
  this.winHideButton = this.winHideButton.bind(this);
  this.titleButton = this.titleButton.bind(this);
  this.titleChange = this.titleChange.bind(this);
}

async componentWillMount() {
  await this.loadWeb3();
  await this.loadBlockchainData();
}
// async componentDidMount(){
//   await this.loadWeb3();
//   await this.loadBlockchainData();
// }

async loadWeb3() {
  if (window.ethereum) {
    window.web3 = await new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = await new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
}

async loadBlockchainData() {
    let candi;
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] });
    console.log(this.state.account);
    const networkId = await web3.eth.net.getId()
    const networkData = Auction.networks[networkId]
    if(networkData) {
      const contract = await new web3.eth.Contract(Auction.abi, networkData.address);
      this.setState({contract:contract});
      const creator = await contract.methods.owner().call();
      this.setState({creator:creator});
      const title = await contract.methods.title().call();
      this.setState({mainHeading:title});
      console.log(creator);
      const flag = await contract.methods.minbid().call();
      console.log(flag);
      console.log(contract);
      console.log(contract._address);
      var start=await this.state.contract.methods.strt().call();
      if(start){this.setState({startAuc:true});}

      var end=await this.state.contract.methods.end().call();
      var cancel=await this.state.contract.methods.cancel().call();
      const minbid=await this.state.contract.methods.minbid().call();
      if(minbid!=0){this.setState({minAuc:true});}
      this.setState({minbidval:minbid});

      const currentbid=await this.state.contract.methods.currentbid().call();
      console.log("start="+start);
      console.log("end="+end);
      console.log("cancel="+cancel);
      console.log("minbid="+minbid);
      console.log("currentbid="+currentbid);
      this.setState({currentbid:currentbid})
      this.setState({winName:await this.state.contract.methods.name().call()});
      this.setState({winNum:await this.state.contract.methods.phone_number().call()});
      this.setState({winValue:await this.state.contract.methods.winningvalue().call()});
      this.setState({winAddr:await this.state.contract.methods.winneraddress().call()});
      //this.setState({result:true});
      console.log("winner="+this.state.winName);
      console.log("winnerNum="+this.state.winNum);
      console.log("winnerValue="+this.state.winValue);
      console.log("winnerAddr="+this.state.winAddr);
      this.setState({currbid:true});
      let recordsAre=await this.state.contract.methods.bidderdetail(this.state.account).call();
      console.log(recordsAre);
      // var len=await this.state.contract.methods.size().call();
      // this.setState({len:len});
      // console.log(len);
      // let showres=this.state.checkshow;
      // for(var i=0;i<len;i++){
      //   var y=await this.state.contract.methods.addr(i).call();
      //   const x=await this.state.contract.methods.bidderdetail(y).call();
      //   showres={
      //     Name:x.name,
      //     phNumber:x.phone_number,
      //     Addr:this.state.account
      //   }
      //   this.state.checkResult.push(showres);
      //   console.log(x);
      // }
      // console.log(this.state.checkResult);
    } else {
      window.alert('Selling contract not deployed to detected network.')

    }
  }
  nameChange(event) {
        this.setState({name: event.target.value});
    }
  numChange(event) {
        this.setState({PhNumber: event.target.value});
  }
  minChange(event) {
        this.setState({minbid: event.target.value});
  }
  bidChange(event) {
        this.setState({bid: event.target.value});
  }
  titleChange(event) {
        this.setState({title: event.target.value});
  }
  async handleSubmit(event) {
    var start=await this.state.contract.methods.strt().call();
    let recordsAre=await this.state.contract.methods.bidderdetail(this.state.account).call();
    if(start==false && recordsAre.isuser==false){
      var name1=String(this.state.name);
      console.log(name1+" "+this.state.PhNumber);
      this.state.contract.methods.createuser(name1,this.state.PhNumber).send({ from: this.state.account });
      let recordsAres=await this.state.contract.methods.bidderdetail(this.state.account).call();
      console.log(recordsAres);
      this.setState({result:false});
    }
    else{
      alert("This user All ready exist");
    }
  }

  async startButton(event) {
    var start=await this.state.contract.methods.strt().call();
    var size=await this.state.contract.methods.size().call();
    var checkmin=await this.state.contract.methods.checkmin().call();
    console.log(start);
    console.log(size);
    console.log(checkmin);
    if(this.state.account==this.state.creator && start==false && size>=2 && checkmin==true){
      this.state.contract.methods.startAuction().send({ from: this.state.account });
      this.setState({result:false});
      this.setState({startAuc:true});
      this.setState({currbid:true});
    }
    else{
      alert("Auction cannot be started");
    }
  }
  async minButton(event) {
    console.log(this.state.minbid);
    if(this.state.account==this.state.creator){
      this.state.contract.methods.minimumbid(this.state.minbid).send({ from: this.state.account });
      this.setState({result:false});
    }
    else{
      alert("You not authorised to set minimum bid")
    }
  }
  async cancelButton(event) {
    console.log("cancelled");
    var start=await this.state.contract.methods.strt().call();
    var end=await this.state.contract.methods.end().call();
    if(this.state.account==this.state.creator && start==true && end==false){
      this.state.contract.methods.cancelAuction().send({ from: this.state.account });
      this.setState({result:false});
      this.setState({currbid:false});
    }
    else{
      alert("you are not authorised to cancel the auction");
    }
  }
  async endButton(event) {
    var start=await this.state.contract.methods.strt().call();
    var end=await this.state.contract.methods.end().call();
    if(this.state.account==this.state.creator && start==true && end==false){
      this.state.contract.methods.endAuction().send({ from: this.state.account });
      this.setState({winName:await this.state.contract.methods.name().call()});
      this.setState({winNum:await this.state.contract.methods.phone_number().call()});
      this.setState({winValue:await this.state.contract.methods.winningvalue().call()});
      this.setState({winAddr:await this.state.contract.methods.winneraddress().call()});
      // this.setState({result:true});
      console.log("winner="+this.state.winName);
      console.log("winnerNum="+this.state.winNum);
      console.log("winnerValue="+this.state.winValue);
      console.log("winnerAddr="+this.state.winAddr);
      this.setState({showWinResult:true});
      this.setState({currbid:false});
    }
    else{
      alert("Auction annnot be ended");
    }
  }
  async bidSubmit(event) {
    console.log(this.state.bid);
    var start=await this.state.contract.methods.strt().call();
    var end=await this.state.contract.methods.end().call();
    var cancel=await this.state.contract.methods.cancel().call();
    const minbid=await this.state.contract.methods.minbid().call();
    const currentbid=await this.state.contract.methods.currentbid().call();
    let recordsAre=await this.state.contract.methods.bidderdetail(this.state.account).call();
    const amount=recordsAre.amount;
    console.log(start);
    console.log(end);
    console.log(cancel);
    console.log(minbid);
    console.log(currentbid);
    const ethamount=Web3.utils.fromWei(amount, 'ether');
    console.log(ethamount);
    if(start==true && end==false && cancel==false && this.state.bid>=Number(minbid) && this.state.bid>Number(currentbid) && this.state.bid<=Number(ethamount)){
      this.state.contract.methods.createbid(this.state.bid).send({ from: this.state.account });
      this.setState({result:false});
    }
    else{
      alert("You are not able to place bid");
    }
  }
  async detailButton(event){
      var len=await this.state.contract.methods.size().call();
      this.setState({len:len});
      console.log(len);
      let showres=this.state.checkshow;
      for(var i=0;i<len;i++){
        var y=await this.state.contract.methods.addr(i).call();
        const x=await this.state.contract.methods.bidderdetail(y).call();
        showres={
          Name:x.name,
          phNumber:x.phone_number,
          Addr:x.addr,
          Amount:x.amount
        }
        this.state.checkResult.push(showres);
        console.log(x);
      }
      console.log(this.state.checkResult);
      this.setState({showUserDetail:false});
      this.setState({hideUserDetail:true});
      this.setState({show:true});

  }
  async hideButton(event){
    this.setState({len:0});
    this.state.checkResult.pop();
    for(var i=0;i<this.state.len;i++){
      this.state.checkResult.pop();
    }
    this.setState({len:0});
    this.setState({show:false});
    this.setState({showUserDetail:true});
  }
  async winDetailButton(event){
    this.setState({winName:await this.state.contract.methods.name().call()});
    this.setState({winNum:await this.state.contract.methods.phone_number().call()});
    this.setState({winValue:await this.state.contract.methods.winningvalue().call()});
    this.setState({winAddr:await this.state.contract.methods.winneraddress().call()});
    this.setState({winAmount:await this.state.contract.methods.bidderdetail(this.state.account).call()});
    this.setState({result:true});
    this.setState({showWinResult:false});
    this.setState({hideWinResult:true});
    console.log("winner="+this.state.winName);
    console.log("winnerNum="+this.state.winNum);
    console.log("winnerValue="+this.state.winValue);
    console.log("winnerAddr="+this.state.winAddr);
  }
  async winHideButton(event){
    this.setState({result:false});
    this.setState({showWinResult:true});
  }
  titleButton(event){
    if(this.state.account==this.state.creator){
        //this.setState({mainHeading:this.state.title});
        this.state.contract.methods.setTitle(this.state.title).send({ from: this.state.account });
    }
    else{
      alert("You are not authorised to set Name");
    }
  }
  render() {
    let showresult;
    let showauc;
    let showtable;
    let showWinnerResult;
    let winBtn;
    let showcurr;
    if(this.state.currbid){
      showcurr=<h3>Current highest Bid = {this.state.currentbid}</h3>
    }
    //{this.showusers()}
    if(this.state.result==true){
      showWinnerResult=
      <div>
        <h2>{this.state.winName} is the winner of Auction</h2>
        <h2>Winner Details</h2>
        <h2>Name :{this.state.winName}</h2>
        <h2>Phone Number :{this.state.winNum}</h2>
        <h2>Account Address :{this.state.winAddr}</h2>
        <h2>Winning Value :{this.state.winValue}</h2>
      </div>
      //  <div className="result-div">
      //         <table className="result-table">
      //             <tr>
      //             <th>Auction Winner</th>
      //             <th>{this.state.winName}</th>
      //             </tr>
      //
      //             <tr>
      //             <th>Bidder Phone Number</th>
      //             <th>{this.state.winNum}</th>
      //             </tr>
      //
      //             <tr>
      //             <th>Bidder Address</th>
      //             <th>{this.state.winAddr.toString()}</th>
      //             </tr>
      //
      //             <tr>
      //             <th>Bidder Ammount</th>
      //             <th>{this.state.winAmount}</th>
      //             </tr>
      //         </table>
      //   </div>
    }
    if(this.state.showWinResult){
      //showResultBtn
      winBtn=<button className="apply-button" onClick={this.winDetailButton}>See Winner</button>
    }
    else if(this.state.hideWinResult){
      //hideResultBtn
      winBtn=<button className="apply-button" onClick={this.winHideButton}>Hide Winner</button>
    }
    if(this.state.minAuc){
      showresult=<div>
      <h2>Minbid : {this.state.minbidval}</h2>
      </div>
    }
    if(this.state.startAuc){
      showauc=<div>
      <h2>{this.state.mainHeading} AUCTION HAS STARTED</h2>
      </div>
    }
    let btn;
    if(this.state.showUserDetail){
      btn=<button className="apply-button" onClick={this.detailButton}>See All Users</button>
    }
    else if(this.state.hideUserDetail){
      btn=<button className="apply-button" onClick={this.hideButton}>Hide All Users</button>
    }
    //console.log(this.state.len);
    if(this.state.len>0 && this.state.show==true){
      showtable=<div className="result-div">
          {this.state.checkResult.map(ob=>(
            <table className="result-table">
                <tr>
                <th>Bidder Name</th>
                <th>{ob.Name}</th>
                </tr>

                <tr>
                <th>Bidder Phone Number</th>
                <th>{ob.phNumber}</th>
                </tr>

                <tr>
                <th>Bidder Address</th>
                <th>{ob.Addr.toString()}</th>
                </tr>

                <tr>
                <th>Bidder Amount</th>
                <th>{ob.Amount.toString()} wie</th>
                </tr>
            </table>
          ))}
      </div>
    }
    else if(this.state.show==true){
      showtable=alert("No User Registered Till Now");
    }
    return (
      <div className="App">
          <header className="App-header">
            <h1>{this.state.mainHeading} AUCTION SMART CONTRACT</h1>
          </header>
       <div>
       <div className="middle">
          <h4>Creator of Auction Smart Contract is      <span className="bloder">{this.state.creator}</span></h4>
          <h4>Current User is     <span className="bloder">{this.state.account}</span></h4>
          {showresult}
          {showauc}
          {showcurr}
          <div className="container1">
            <div className="container11">
              <h2>FOR USER</h2>
              <div className="container11-1">
                <h3>REGISTER HERE FOR AUCTION</h3>
                <label>NAME  :</label><br />
                <input type="text" value={this.state.name} onChange={this.nameChange} placeholder="Enter Name" required /><br />
                <label>PHONE NUMBER  :</label><br />
                <input type="text" value={this.state.PhNumber} onChange={this.numChange} placeholder="Enter Phone Number" required /><br />
                <button className="apply-button" onClick={this.handleSubmit}>SUBMIT</button><br />
              </div>
              <div className="container11-2">
              <h3> START PLACING BID IN THE AUCTION</h3>
              <label>PLACE BID  :</label><br />
              <input type="text" value={this.state.bid} onChange={this.bidChange} placeholder="Enter Bid" required /><br />

              <button className="apply-button" onClick={this.bidSubmit}>PLACE BID</button>
              </div>
            </div>
            <div className="container12">
              <h2>FOR AUCTION OWNER</h2>
              <div className="container12-11">
                <h3> SET THE AUCTION ITEM</h3>
                <input type="text" value={this.state.title} onChange={this.titleChange} placeholder="Enter Minimum Bid" required /><br />
                <button className="apply-button" onClick={this.titleButton}>SET TITLE</button>
              </div>
              <div className="container12-1">
              <h3> SET THE MINIMUM BID BEFORE THE AUCTION STARTS</h3>
              <input type="text" value={this.state.minbid} onChange={this.minChange} placeholder="Enter Minimum Bid" required /><br />
              <button className="apply-button" onClick={this.minButton}>SET MINIMUM BID</button>
              </div>
              <button className="apply-button" onClick={this.startButton}>START AUCTION</button><br />
              <button className="apply-button" onClick={this.cancelButton}>CANCEL AUCTION</button>
              <button className="apply-button" onClick={this.endButton}>END AUCTION</button>
              {winBtn}
            </div>
          </div>
          {btn}
          {showtable}
          {showWinnerResult}
       </div>
     </div>
     </div>
    );
  }
}

export default App;
