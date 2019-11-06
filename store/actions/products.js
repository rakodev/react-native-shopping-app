import Product from "../../models/product";

const PRODUCTS_URL = "https://rn-shop-demo-app.firebaseio.com/products.json";
const PRODUCTS_UPDATE_URL =
  "https://rn-shop-demo-app.firebaseio.com/products/_productId_.json";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async dispatch => {
    // any async code you want!
    try {
      const response = await fetch(PRODUCTS_URL);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            "u1",
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      dispatch({ type: SET_PRODUCTS, products: loadedProducts });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async dispatch => {
    await fetch(PRODUCTS_UPDATE_URL.replace("_productId_", productId), {
      method: "DELETE"
    });

    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async dispatch => {
    // any async code you want!
    const response = await fetch(PRODUCTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price
      })
    });

    const resData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price
      }
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async dispatch => {
    await fetch(PRODUCTS_UPDATE_URL.replace("_productId_", id), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl
      })
    });

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl
      }
    });
  };
};
