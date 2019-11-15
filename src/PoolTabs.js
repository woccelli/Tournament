import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Table from 'react-bootstrap/Table'



class PoolTabs extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {
        let poolTabs;
        if(this.props.pools != null && this.props.pools.length > 0) {
            var poolsClone = this.props.pools;
            poolTabs = 
            <Tabs defaultActiveKey={poolsClone[0].name} id="pools">
                {poolsClone.map(item => 
                    <PoolTab key={item.name} name={item.name}>{item.name}</PoolTab>
                )}
            </Tabs>
        } else {
            poolTabs = null
        }


        return (
            <div className="Pools">
                {poolTabs}
            </div>
        )
    }
}

class PoolTab extends React.Component {
    render() { 
        return (
                <Tab eventKey={this.props.key} title={this.props.name}> 
                Test
                </Tab>
        )
    }

}

export default PoolTabs;
