import React, { Component } from 'react'

import Hero from '../../components/Hero'

import TileCountUser from './TileCountUser'
import TileCountSeller from './TileCountSeller'
import TileCountSupplier from './TileCountSupplier'
import TileCountProduct from './TileCountProduct'
import TileCountOrderSuccess from './TileCountOrderSuccess'
import TileCountOrderWarning from './TileCountOrderWarning'
import TileCommissioningAlert from './TileCommissioningAlert'
import TileGraphCommissioningProduct from './TileGraphCommissioningProduct'
import TileCommissioningProcess from './TileCommissioningProcess'

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: 5,
      products: 5,
      last_ten_comissioning_alerts: [],
      last_ten_comissioning_process: [],
      graph_comission_vs_product:[]
    }
  }

  render() {
    return (
      <div className="">
        <Hero title="Dashboard" subtitle="Overview" />

        <section className="section">
          <div className="container">
            <div className="tile is-ancestor">
              <TileCountUser />
              <TileCountSeller />
              <TileCountSupplier />
              <TileCountProduct />
            </div>
            <div className="tile is-ancestor">
              <div className="tile is-vertical is-8">
                <div className="tile">
                  <div className="tile is-parent is-vertical">
                    <TileCountOrderSuccess data={this.state.users} />
                    <TileCountOrderWarning data={this.state.products} />
                  </div>
                  <TileGraphCommissioningProduct data={this.state.graph_comission_vs_product} />
                </div>
                <TileCommissioningAlert data={this.state.last_ten_comissioning_alerts} />
              </div>
              <TileCommissioningProcess data={this.state.last_ten_comissioning_process} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Dashboard
