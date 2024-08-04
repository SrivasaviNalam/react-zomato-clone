import { useParams, useNavigate  } from "react-router-dom";
import "../css/search.css";
import Header from "../components/Header";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Pagination from "./Pagination";

const Search = () => {
  let { name } = useParams();
  let [filter, setFilter] = useState({
    sort: 1,
    cuisine: [],
    location: null,
    costForTwo: {minPrice:null,maxPrice:null}
  });
  let [restaurantList, setRestaurantList] = useState([]);
  let [locationList, setLocationList] = useState([]);
  let [currentPage,setCurrentPage] = useState(1);
  let pageSize= 2;
  let navigate = useNavigate();

  let onPageChange = (value) => {
    setCurrentPage(value);
  }

  let getLocationList = async () => {
    try {
      let url = "http://localhost:3040/api/get-location-list";
      let {
        data: { result },
      } = await axios.get(url);
      setLocationList(result);
    } catch (error) {
      alert("server error");
      console.log(error);
    }
  };

  let setFilterData = (e, type) => {
    let value = e.target.value;
    let _filter = {...filter};
    switch(type) {
      case "location":
        value = Number(value);
        if(value === -1) {
          _filter[type] = null;
        } else {
          _filter[type] = value;
        }
        break;
      case "cuisine":
        value = Number(value);
        if(e.target.checked) {
          _filter[type].push(value);
        } else {
          _filter[type] = _filter[type].filter((cuisine) => cuisine !== value);
        }
        break;
      case "costForTwo":
        switch(value) {
          case "<500":
            _filter["costForTwo"] = {minPrice: null, maxPrice: 500};
            break;
          case "500-1000":
            _filter["costForTwo"] = {minPrice: 500, maxPrice: 1000};
            break;
          case "1000-1500":
            _filter["costForTwo"] = {minPrice: 1000, maxPrice: 1500};
            break;
          case "1500-2000":
            _filter["costForTwo"] = {minPrice: 1500, maxPrice: 2000};
            break;
          default:
            _filter["costForTwo"] = {minPrice: 2000, maxPrice: null};
            break;
        }
        break;
      case "sort":
        _filter[type] = Number(value);
        break;
      default:
        break;
    }
    setFilter({..._filter});
  };

  let getRestaurantList = async () => {
    try {
      let url = "http://localhost:3040/api/filter";
      let { data } = await axios.post(url, filter);
      setRestaurantList(data.result);
      setCurrentPage(1);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getLocationList();
  }, []);

  useEffect(()=> {
    getRestaurantList();
  }, [filter])

  let currentRestaurantDetails = useMemo(() => {
    if(restaurantList.length === 0 ) {
      return null
    } 
    let firstIndex = (currentPage - 1) * pageSize;
    let lastIndex = firstIndex + pageSize;
    return restaurantList.slice(firstIndex,lastIndex);
  },[currentPage,restaurantList])

  return (
    <div className="search-page">
      <Header />
      <section className="row bg-light">
        <section className="col-11 col-lg-10 m-auto">
          <h3 className="fw-bold header-text-color d-none d-lg-block search-head">
            {name} Search result
          </h3>
          <section className="row gap-lg-4">
            {/* <!-- collapse filter ui for mobile--> */}
            <section className="col-12 col-lg-3 my-shadow p-2 bg-white mb-2 d-flex justify-content-between d-lg-none">
              <p className="m-0 fw-bold">Filter/Sort</p>
              <button
                data-bs-toggle="collapse"
                data-bs-target="#collapseFilter"
              >
                Show/Hide
              </button>
            </section>
            {/* <!-- filter --> */}
            <section
              className="col-12 col-lg-3 my-shadow p-3 pt-2 bg-white collapse d-lg-block"
              id="collapseFilter"
            >
              <p className="m-0 fw-bold">Filter</p>
              <div className="my-2">
                <label className="form-label text-primary fw-bold">
                  Select Location
                </label>
                <select className="form-select" onChange={(e) => setFilterData(e, "location")}>
                  <option value="-1">---- Select ----</option>
                  {locationList.map((location) => {
                    return (
                      <option key={location._id} value={location.location_id}>
                        {location.name}, {location.city}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="my-2 mt-3">
                <label className="form-label text-primary fw-bold">
                  Cuisine
                </label>
                <div className="form-check">
                  <input type="checkbox" id="northIndian" className="form-check-input" value={1} onClick={(e) => setFilterData(e,"cuisine")}/>
                  <label htmlFor="northIndian" className="form-check-label text-muted">
                    North Indian
                  </label>
                </div>
                <div className="form-check">
                  <input type="checkbox" id="southIndian" className="form-check-input" value={2} onClick={(e) => setFilterData(e,"cuisine")}/>
                  <label htmlFor="southIndian" className="form-check-label text-muted">
                    South Indian
                  </label>
                </div>
                <div className="form-check">
                  <input type="checkbox" id="chinese" className="form-check-input" value={3} onClick={(e) => setFilterData(e,"cuisine")}/>
                  <label htmlFor="chinese" className="form-check-label text-muted">
                    Chinese
                  </label>
                </div>
                <div className="form-check">
                  <input type="checkbox" id="fastFood" className="form-check-input" value={4} onClick={(e) => setFilterData(e,"cuisine")}/>
                  <label htmlFor="fastFood" className="form-check-label text-muted">
                    Fast Food
                  </label>
                </div>
                <div className="form-check">
                  <input type="checkbox" id="streetFood" className="form-check-input" value={5} onClick={(e) => setFilterData(e,"cuisine")}/>
                  <label htmlFor="streetFood" className="form-check-label text-muted">
                    Street Food
                  </label>
                </div>
              </div>

              <div className="my-2 mt-3">
                <label className="form-label text-primary fw-bold">
                  Cost For Two
                </label>
                <div className="form-check">
                  <input type="radio" id="costRange" className="form-check-input" name="costForTwo" value={"<500"} onClick={(e) => setFilterData(e,"costForTwo")}/>
                  <label htmlFor="costRange" className="form-check-label text-muted">
                    Less than ` 500
                  </label>
                </div>
                <div className="form-check">
                  <input type="radio" id="costRange2" className="form-check-input" name="costForTwo" value={"500-1000"} onClick={(e) => setFilterData(e,"costForTwo")}/>
                  <label htmlFor="costRange2" className="form-check-label text-muted">
                    ` 500 to ` 1000
                  </label>
                </div>
                <div className="form-check">
                  <input type="radio" id="costRange3" className="form-check-input" name="costForTwo" value={"1000-1500"} onClick={(e) => setFilterData(e,"costForTwo")}/>
                  <label htmlFor="costRange3" className="form-check-label text-muted">
                    ` 1000 to ` 1500
                  </label>
                </div>
                <div className="form-check">
                  <input type="radio" id="costRange4" className="form-check-input" name="costForTwo" value={"1500-2000"} onClick={(e) => setFilterData(e,"costForTwo")}/>
                  <label htmlFor="costRange4" className="form-check-label text-muted">
                    ` 1500 to ` 2000
                  </label>
                </div>
                <div className="form-check">
                  <input type="radio" id="costRange5" className="form-check-input" name="costForTwo" value={">2000"} onClick={(e) => setFilterData(e,"costForTwo")}/>
                  <label htmlFor="costRange5" className="form-check-label text-muted">
                    ` 2000+
                  </label>
                </div>
              </div>

              <div className="my-2 mt-3">
                <label className="form-label text-primary fw-bold">
                  Sort
                </label>
                <div className="form-check">
                  <input type="radio" id="ascSort" className="form-check-input" name="sort" value={1} onClick={(e) => setFilterData(e,"sort")}/>
                  <label htmlFor="ascSort" className="form-check-label text-muted">
                    Price low to high
                  </label>
                </div>
                <div className="form-check">
                  <input type="radio" id="descSort" className="form-check-input" name="sort" value={-1} onClick={(e) => setFilterData(e,"sort")}/>
                  <label htmlFor="descSort" className="form-check-label text-muted">
                    Price high to low
                  </label>
                </div>
              </div>
            </section>

            {/* <!-- restaurant --> */}
            <section className="col-12 col-lg-8 mt-3 mt-lg-0 px-0 px-lg-3">
              {currentRestaurantDetails ? (
                currentRestaurantDetails.map((restaurant,index) => {
                  return (
                    <section key={index} className="my-shadow bg-white p-4 mb-3 search-restaurant-item" onClick={() => navigate(`/restaurant-page/${restaurant._id}`)}>
                      <section className="d-flex gap-3 align-items-center">
                        <img
                          src={`/images/${restaurant.image}`}
                          alt=""
                          className="restaurant-image"
                        />
                        <div>
                          <p className="mb-2 h4 fw-bold header-text-color">
                            {restaurant.name}
                          </p>
                          <p className="mb-1 fw-bold">{restaurant.locality}</p>
                          <p className="text-muted mb-0">
                            {restaurant.city}
                          </p>
                        </div>
                      </section>
                      <hr />
                      <section className="row">
                        <section className="col-lg-3 col-6">
                          <p className="mb-1">CUISINES : </p>
                          <p className="m-0">COST FOR TWO : </p>
                        </section>
                        <section className="col-lg-9 col-6">
                          <p className="mb-1">{restaurant.cuisine.map((item) => {
                            return item.name
                          }).join(", ")}</p>
                          <p className="m-0">{restaurant.min_price}</p>
                        </section>
                      </section>
                    </section>
                  )
                })
              ) : (<p>No Restaurants Found.</p>)}

              {/* <!--  pagination --> */}
              {/* <!-- <input type="checkbox" className="change-color" /> --> */}
              <section className="d-flex justify-content-center">
                {
                  restaurantList && (
                    <Pagination
                      totalCount={restaurantList.length}
                      pageSize={pageSize}
                      currentPage={currentPage}
                      className="my-pagination"
                      onPageChange = {onPageChange}
                    />
                  )
                }
              </section>
            </section>
          </section>
        </section>
      </section>
    </div>
  );
};

export default Search;
