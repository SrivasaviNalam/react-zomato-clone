import { useParams } from 'react-router-dom';
import '../css/restaurant.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Header from '../components/Header';

const Restaurant = () => {
  const { id } = useParams();
  const [rDetails,setRDetails] = useState(null);
  const [rMenuList,setRMenuList] =useState([]);
  let [total,setTotal] = useState(0);
  useEffect(() => {
    const getRestaurantDetails = async () => {
      try {
        let url = `http://localhost:3040/api/get-single-restaurant-by-res-id/${id}`;
        const {data : {result}} = await axios.get(url);
        setRDetails(result);
      } catch(error) {
        alert('server error');
        console.log(error);
      }
    }

    const getMenuItemsList = async () => {
      let url = `http://localhost:3040/api/get-menu-item-list/${id}`;
      const {data : {result}} = await axios.get(url);
      setRMenuList(result);
    }

    getRestaurantDetails();
    getMenuItemsList();
  },[id]);

  const incQty = (index) => {
    const _rMenuList = [...rMenuList];
    _rMenuList[index].qty += 1;
    total += _rMenuList[index].price;
    setTotal(total);
    setRMenuList(_rMenuList);
  }

  const decQty = (index) => {
    const _rMenuList = [...rMenuList];
    _rMenuList[index].qty -= 1;
    total -= _rMenuList[index].price;
    setTotal(total);
    setRMenuList(_rMenuList);
  }

  const getPaymentView = async () => {
    let url = "http://localhost:3040/api/create-order";
    let { data } = await axios.post(url,{amount: total});
    var options = {
      "key": "rzp_test_RB0WElnRLezVJ5", // Enter the Key ID generated from the Dashboard
      "amount": total * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      "currency": "INR",
      "name": "Zomato App",
      "description": "Make Your Now",
      "image": "https://logos-world.net/wp-content/uploads/2020/11/Zomato-Logo.png",
      "order_id": data.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      "handler": async function (response){
        let sendData = {
          payment_id:response.razorpay_payment_id,
          order_id:response.razorpay_order_id,
          signature:response.razorpay_signature
        }

        let url = "http://localhost:3040/api/verify-payment";
        let { data } = await axios.post(url,sendData);
        console.log(data);
      },
      "prefill": {
          "name": "Srivasavi",
          "email": "srivasavi@gmail.com",
          "contact": "9876543210"
      }
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
  }

  return (
    <>
      {rDetails === null ? (<div>No Data Found</div>) : (
        <div className="restaurant-page">
          <Header />
          <section className='inner-section'>
            <div className="image-section">
              <img className="rest-img" alt="Meal-image" src={`/images/${rDetails.image}`}/>
              <button type="button" className="gallery-btn btn btn-primary" data-toggle="modal" data-target="#imageGallery">
                Click to see Image Gallery
              </button>
              {/* <!-- Modal --> */}
              <div className="modal fade" id="imageGallery" tabIndex="-1" role="dialog" aria-labelledby="imageGalleryLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <Carousel showThumbs={false} infiniteLoop={true}>
                        {rDetails.thumb.map((image,index) => {
                          return (
                            <div key={index} className='w-100'>
                              <img src={`/images/${image}`} alt={`Thumbnail-${index}`}/>
                            </div>
                          )
                        })}
                      </Carousel>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className='inner-section'> 
            <h1>{rDetails.name}</h1>
            <a className="btn btn-primary" data-bs-toggle="modal" href="#selectMenu" role="button">Select Menu</a>
            {/* <!-- Toggle Modal --> */}
            <div className="modal fade" id="selectMenu" aria-hidden="true" aria-labelledby="selectMenuLabel" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="selectMenuLabel">{rDetails.name}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    {rMenuList.map((menu,index) => {
                      return (
                        <div className="row p-2" key={menu._id}>
                          <div className="col-8">
                            <p className="mb-1 h6">{menu.name}</p>
                            <p className="mb-1">{menu.price}</p>
                            <p className="small text-muted">{menu.description}</p>
                          </div>
                          <div className="col-4 d-flex justify-content-end">
                            <div className="menu-food-item">
                              <img className="w-100" src={`/images/${menu.image}`} alt={menu.name} />
                              {menu.qty === 0 ? <button className='btn btn-primary btn-sm add' onClick={() => incQty(index)}>Add</button> : (
                                <div className="order-item-count section">
                                  <span className="hand" onClick={() => decQty(index)}>-</span>
                                  <span>{menu.qty}</span>
                                  <span className="hand" onClick={() => incQty(index)}>+</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <hr className="p-0 my-2" />
                        </div>
                      )
                    })}
                    {total === 0 ? null : (
                      <div className="d-flex justify-content-between">
                        <h3>Total: {total} /-</h3>
                        <button className="btn btn-primary" data-bs-target="#userInfoScreen" data-bs-toggle="modal" data-bs-dismiss="modal">Next</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="userInfoScreen" aria-hidden="true" aria-labelledby="userInfoScreenLabel" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="userInfoScreenLabel">User Details</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label" htmlFor="name">
                        Name
                      </label>
                      <input className="form-control" id="name" type="text" placeholder="Enter Your Name" value="Srivasavi" required onChange={() => {}}/>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="mobileNumber">Mobile Number</label>
                      <input className="form-control" id="mobileNumber" type="tel" placeholder='Enter mobile number' value={9876543210} pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required onChange={() => {}}/>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="address">
                        Address
                      </label>
                      <textarea className="form-control" id="address" placeholder="Enter your address" rows="4" cols="50" value={"Hyderabad"} required onChange={() => {}}></textarea>
                    </div>
                    <p><i>Your payment for this order is <b className="text-primary">{total} /-</b></i></p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-danger" data-bs-target="#selectMenu" data-bs-toggle="modal" data-bs-dismiss="modal">Back</button>
                    <button className="btn btn-primary btn-success" onClick={() => getPaymentView()}>Pay Now</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className='inner-section'>
            <div className="restaurant-info-section">
              <div className="restaurant-overview-content">
                <h5 className='overview-head'>Overview & Contact</h5>
                <hr />
                <div className="overview-content">
                <h3>About this place</h3>
                    <p className='info-head'>Cuisine</p>
                    <p>{rDetails.cuisine.map((value) => value.name).join(", ")}</p>
                    <p className='info-head'>Average Cost</p>
                    <p>₹{rDetails.min_price} for two people (approx.)</p>
                    <p><strong>Phone Number</strong></p>
                    <p className="red-txt">+{rDetails.contact_number}</p>
                    <p><strong>Address</strong></p>
                    <p className="address">{rDetails.locality}, {rDetails.city}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default Restaurant;