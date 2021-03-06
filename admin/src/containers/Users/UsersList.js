import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
// Services

import UserService from '../../services/UserService'

// Components
import Hero from '../../components/Hero'
import Breadcrumb from '../../components/Breadcrumb'
import BoxSearch from '../../components/BoxSearch'
import BoxSearchPerPage from '../../components/BoxSearchPerPage'
import BoxSearchCountItems from '../../components/BoxSearchCountItems'

import BoxFilterUser from './BoxFilterUser'
import BoxUser from './BoxUser'

// 3 packages

import ReactPaginate from 'react-paginate'

class UserList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      name: 'Usuário(s)',
      search_args: {
        field: 'email',
        query: '',
        operator: 'equal',
        per_page: 10,
        is_active: 3,
        is_admin: 3,
        is_superuser: 3,
        page: 1
      },
      pages: 1,
      users: [],
      count_users: 0,
      fields:[
        {key:'email', value:'Email'},
        {key:'name', value:'Name'}
      ],
      operators:[
        {key:'equal', value:'Equals to'},
        {key:'startswith', value:'startswith'},
        {key:'contains', value:'Contain'}
      ]
    }

    this.updateField = this.updateField.bind(this)
    this.updateOperator = this.updateOperator.bind(this)
    this.updateQuery = this.updateQuery.bind(this)
    this.updatePerPage = this.updatePerPage.bind(this)
    this.updateBoxFilter = this.updateBoxFilter.bind(this)
    this.searchBox = this.searchBox.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.clearFilters = this.clearFilters.bind(this)
    this.search = this.search.bind(this)
  }

  updatePerPage(args) {
    let { search_args } = this.state

    args = parseInt(args, 10)

    search_args.per_page = args

    this.setState({ search_args }, () => this.search())
  }

  updateField(value) {
    let { search_args } = this.state

    search_args.field = value

    this.setState({ search_args })
  }

  updateOperator(value) {
    let { search_args } = this.state

    search_args.operator = value

    this.setState({ search_args })
  }

  updateBoxFilter(name, args) {

    let { search_args } = this.state

    args = parseInt(args, 10)

    search_args[name] = args

    this.setState({ search_args }, () => this.search())
  }

  clearFilters() {
    let { search_args } = this.state
    search_args.is_active = 3
    search_args.is_admin = 3
    search_args.is_superuser = 3
    this.setState({ search_args },() => {
      this.search()
    })
  }

  updateQuery(value) {
    // dica
    // const search_args = {
    //     ...(this.state.searchArgs || {}),
    //     ...(args || {})
    // };

    let { search_args } = this.state

    search_args.query = value

    this.setState({ search_args })

  }

  searchBox(e) {
    e.preventDefault()
    this.search()
  }

  handlePageClick(data) {

    let { search_args } = this.state
    search_args.page = data.selected + 1
    this.setState(search_args, () => {
      this.search()
    })
  }

  search() {
    UserService.getUsersPerPage(this.state.search_args)
    .then(
      (data) => {

        if (data.success) {
          this.setState({
            users: data.data,
            count_users: data.total,
            pages: data.pages
          })
        }

      }
    ).catch(
      (error) => {
        console.log('tratar status code response', error)
      }
    )
  }

  componentDidMount() {
    // this.search()
  }

  render() {

    const items = this.state.users.map((item, index)=>{
      return (
        <BoxUser
          key={index}
          id={item.id}
          name={item.name}
          email={item.email}
          active={item.active}
          is_admin={item.is_admin}
          is_superuser={item.is_superuser}
        />
      )
    })

    return (

      <div className="">
        <Hero title="Sellers" subtitle="All sellers" />
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-three-quarters">
                <Breadcrumb items={[
                  {
                    name: 'Dashboard',
                    url: '/dashboard/',
                  }, {
                    name: 'Sellers',
                    url: '/sellers/',
                    active: true
                  },
                ]} />
              </div>
              <div className="column has-text-right">
                <NavLink
                  to="/dashboard/sellers/add/"
                  className="button is-success"
                >
                  Add
                </NavLink>
              </div>
            </div>
          </div>
        </section>
        <section className="">
          <BoxSearch
            fields={this.state.fields}
            operators={this.state.operators}
            field={this.state.search_args.field}
            operator={this.state.search_args.operator}
            query={this.state.search_args.query}
            updateField={this.updateField}
            updateOperator={this.updateOperator}
            updateQuery={this.updateQuery}
            search={this.searchBox}
          />
        </section>
        <section className="">
          <div className="container">
            <div className="columns">

              <BoxSearchCountItems
                count={this.state.count_users}
                name={this.state.name}
              />

              <div className="column">
                Exibindo {this.state.search_args.page} de {this.state.pages} páginas
              </div>

              <BoxSearchPerPage updatePerPage={this.updatePerPage} />

            </div>
          </div>
        </section>

        <section className="">
          <div className="container">
            <div className="columns">
                <div className="column is-one-quarter">
                  <BoxFilterUser
                    active={this.state.search_args.is_active}
                    admin={this.state.search_args.is_admin}
                    superuser={this.state.search_args.is_superuser}
                    updateBoxFilter={this.updateBoxFilter}
                    clearFilters={this.clearFilters}
                  />
                </div>
                <div className="column">
                  {items}
                </div>
            </div>
          </div>
        </section>

        <section className="">
          <div className="container">
            <div className="columns">
              <div className="column is-half is-offset-one-quarter">

                  <ReactPaginate
                    nextLinkClassName={"pagination-next"}
                    nextLabel={"Próximo"}
                    previousLinkClassName={"pagination-previous"}
                    previousLabel={"Anterior"}
                    breakLabel={<a href="">...</a>}
                    breakClassName={"pagination-ellipsis"}
                    pageCount={this.state.pages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    initialPage={0}
                    disabledClassName={"disabled"}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination-list"}
                    pageLinkClassName={"pagination-link"}
                    activeClassName={"is-current"}
                  />

              </div>
            </div>
          </div>
        </section>
      </div>

    )
  }
}


export default UserList
