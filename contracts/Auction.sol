pragma solidity >=0.5.13 < 0.7.3;
contract Auction{
    address public owner;
    address public highestbidder;
    address public winneraddress;
    uint256 public minbid;
    uint256 public bidvalue;
    uint256 public currentbid=0;
    uint256 public winningvalue=0;
    uint256 public size=0;
    address [] public addr;
    string public name;
    string public phone_number;
    string public title;
    bool public strt = false;
    bool public end = false;
    bool public cancel = false;
    bool public checkmin = false;
    struct bidder{
        string name;
        string phone_number;
        uint256 amount;
        bool isuser;
        address addr;
    }
    mapping(address => bidder) public bidderdetail;

    function createuser(string memory _name,string memory _phone_number) public {
        require(strt==false,"Already started now cannot add user");
        require(bidderdetail[msg.sender].isuser==false,"Already present");
        bidderdetail[msg.sender].name=_name;
        bidderdetail[msg.sender].phone_number=_phone_number;
        bidderdetail[msg.sender].amount = msg.sender.balance;
        bidderdetail[msg.sender].addr = msg.sender;
        addr.push(msg.sender);
        bidderdetail[msg.sender].isuser = true;
        size++;
    }
    constructor ()public {
        owner = msg.sender;
    }
    function setTitle(string memory _title) public{
      title = _title;
    }
    function minimumbid(uint256 _minubid) public {
        require(msg.sender==owner,"You are not the owner");
        minbid=_minubid;
        checkmin = true;
    }
    function createbid(uint256 _bidvalue) public {
        require(bidderdetail[msg.sender].isuser==true,"Cannot participate");
        bidvalue=_bidvalue;
        require(strt,"Bid is not started");
        require(end==false,"Bid is ended");
        require(cancel==false,"Bid is cancelled");
        require(bidvalue>=minbid,"Insufficient bid");
        require(bidvalue>currentbid,"Placemore bid");
        require(bidvalue<=bidderdetail[msg.sender].amount);
        currentbid=bidvalue;
        bidderdetail[msg.sender].amount-=bidvalue;
        highestbidder=msg.sender;
    }
    function startAuction() public{
        winningvalue=0;
        winneraddress=address(0);
        require(msg.sender==owner,"You are not owner");
        require(strt==false,"Bid is already started");
        require(size>=2,"Insuffient Bidder");
        require(checkmin==true,"Please set minimun bid first");
        strt = true;

        name="";
        phone_number="";
    }
    function cancelAuction() public {
        uint256 i;
        require(strt,"Bid is not started");
        require(end==false,"Bid is ended");
        require(msg.sender==owner,"You are not owner");
        cancel=true;
        for(i=0;i<size;i++)
        {
            bidderdetail[addr[i]].name="";
            bidderdetail[addr[i]].phone_number="";
            bidderdetail[addr[i]].amount=0;
            bidderdetail[addr[i]].isuser=false;
        }
        addr.length=0;
        cancel=false;
        strt=false;
        end=false;
        highestbidder=address(0);
        currentbid=0;
        winningvalue=0;
        minbid=0;
        name="";
        checkmin=false;
        size = 0;
    }
    function endAuction() public payable{
        require(strt,"Bid is not started");
        require(msg.sender==owner,"Only owner accessable");
        winningvalue=currentbid;
        winneraddress=highestbidder;
        name = bidderdetail[highestbidder].name;
        phone_number = bidderdetail[highestbidder].phone_number;
        address(msg.sender).transfer(msg.value);
        end = true;
        for(uint i=0;i<size;i++)
        {
            bidderdetail[addr[i]].name="";
            bidderdetail[addr[i]].phone_number="";
            bidderdetail[addr[i]].amount=0;
            bidderdetail[addr[i]].isuser=false;
        }
        addr.length=0;
        cancel=false;
        strt=false;
        end=false;
        highestbidder=address(0);
        currentbid=0;
        minbid=0;
        checkmin=false;
        size = 0;
    }
}
