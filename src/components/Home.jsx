import { useEffect, useState } from 'react';
import '../css/main.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";

const Home = () => {
  const initData ={
    city: "",
    city_id: 0,
    country_name: "",
    location_id: 0,   
    name: "",
    _id: ""
  }
  const [mealsList,setMealsList] = useState([]);
  const [locationList,setLocationList] = useState([]);
  const [hideLocation, setHideLocation] =useState(true);
  const [selectLocation, setSelectLocation] = useState({...initData});
  const [restaurantsByLocId,setRestaurantsByLocId] = useState({
    list:[],
    message: "No Restaurants Found"
  });
  const [hideRestaurants, setHideRestaurants]= useState(true);
  const navigate = useNavigate();

  const getMealTypeList = async () => {
    try {
      let url = "http://localhost:3040/api/get-meal-type-list";
      let response = await axios.get(url);
      setMealsList(response.data.result);
    } catch(error) {
      alert("Server error");
      console.log(error);
    }
  }

  const getLocationList = async () => {
    try {
      let url = "http://localhost:3040/api/get-location-list";
      let response = await axios.get(url);
      setLocationList(response.data.result);
    } catch(error) {
      alert("Server error");
      console.log(error);
    }
  }

  const getRestaurantListByLocId = async () => {
    try {
      let url = "http://localhost:3040/api/get-restaurant-list-by-loc-id/"+selectLocation.location_id;
      let response = await axios.get(url);
      setRestaurantsByLocId({
        list: response.data.result,
        message: response.data.result.length + " restaurants found"
      });
    } catch(error) {
      alert("Server error");
      console.log(error);
    } 
  }

  let getLocationByIndex = (index) => {
    setSelectLocation(locationList[index]);
    setHideLocation(true);
    setHideRestaurants(false);
  }

  useEffect(() => {
    getMealTypeList();
    getLocationList();
  },[]);

  useEffect(() => {
    if(selectLocation.name !== "") {
      getRestaurantListByLocId();
    }
    //eslint-disable-next-line
  },[selectLocation])
    
	return (
		<div className='home-page'>
			<section className="main-section">
        <Header page={'home'}/>
				<div className="home-brand">
					<span className="brand-text">e!</span>
				</div>
				<p className="sub-title">Find the best restaurants, cafés, and bars</p>
				<section className="search gap-lg-3 d-flex align-items-start">
          <div className='w-50 location-search-container position-relative'>
            <input
              placeholder="Enter Location"
              type="text"
              className="search-location w-100"
              readOnly
              onClick = {() => setHideLocation(!hideLocation)}
              value={selectLocation.name === "" ? "" : `${selectLocation.name}, ${selectLocation.city}`}
            />
            {hideLocation ? null : (
              <ul className="list-group location-list-group">
                {locationList.map((location, index) => {
                  return (
                    <li className="list-group-item" key={location._id} onClick={() => getLocationByIndex(index)}>{location.name}, {location.city}</li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className='w-50 position-relative'>
            <input
              placeholder={restaurantsByLocId.message}
              type="text"
              className="search-restaurant w-100"
              onChange={()=>{}}
              readOnly
            />
            {hideRestaurants ? null : (
              <ul className="list-group">
                {restaurantsByLocId.list.map((restaurant, index) => {
                  return (
                    <li className="list-group-item" key={restaurant._id} onClick={() => navigate(`/restaurant-page/${restaurant._id}`)}>
                      <img className="me-2" style={{width:'50px',height:'50px',borderRadius:'50%'}} src={`/images/${restaurant.image}`} alt={`${restaurant.name} restaurant`}/>
                      <span>{restaurant.name}, {restaurant.city}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
				</section>
			</section>
			<section className="meal-type-main-section">
				<section className="meal-type-sub-section">
					<h1 className="meal-type-main-title">Quick Searches</h1>
					<p className="meal-type-sub-title">Discover restaurants by type of meal</p>
					<section className="meal-type-list">
            {mealsList.map((meal) => {
              return (
                <article className="meal-type-item"key={meal._id} onClick={()=> navigate(`/search/${meal.meal_type}/${meal.name}`)}>
                  <div className="meal-type-item-img-div">
                    <img
                      className="meal-type-item-img"
                      src={`./images/${meal.image}`}
                      alt=""
                    />
                  </div>
                  <div className="meal-type-item-p-div">
                    <p className="meal-type-item-title">{meal.name}</p>
                    <p className="meal-type-item-sub-title">
                      {meal.content}
                    </p>
                  </div>
                </article>
              )
            })}
					</section>
				</section>
			</section>
		</div>
	)
}

export default Home;