import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import { GContext } from "../../context/CartContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import CartItem from "../cart/CartItem";
import { Button } from "react-bootstrap";

// Estilos
import "./Form.css";

// componentes

//        LOGICA

// Función constructora
const BuyForm = () => {
  const [paymenthMethod, setPaymenthMethod] = useState();

  const handleSelectChange = ({ value }) => {
    console.log(value);
    setPaymenthMethod(value);
  };

  const paymenths = [
    { label: "Mercado Pago", value: "Mercado Pago" },
    { label: "Tarjeta de débito", value: "Tarjeta de débito" },
    { label: "Tarjeta de crédito", value: "Tarjeta de crédito" },
    { label: "Pago Fácil (efectivo)", value: "Pago Fácil" },
    { label: "Rapi Pago (efectivo)", value: "Rapi Pago" },
  ];

  const { itemsCarrito, getTotal, clear } = useContext(GContext);

  const [orderId, setOrderId] = useState(undefined);

  const [orderData, setOrderData] = useState();

  const [formSend, setFormSend] = useState(false);

  const [length, setLength] = useState(true);

  const sendOrder = async (order) => {
    const queryRef = collection(db, "orders");
    const response = await addDoc(queryRef, order);
    setOrderId(response.id);
    clear();
  };

  useEffect(() => {
    if (itemsCarrito.length === 0) {
      setTimeout(() => {
        setLength(false);
      }, 5000);
    } else {
      setLength(true);
    }
  }, [itemsCarrito]);

  return (
    <Formik
      initialValues={{
        name: "",
        phone: "",
        email: "",
        province: "",
        street: "",
        location: "",
        number: "",
        postal: "",
        paymenthMethod: "",
        facturation: "",
        facturationData: "",
      }}
      validate={(values) => {
        // validaciones de los datos que ingreso el usuario
        let errors = {};

        // ERROR NOMBRE
        if (!values.name) {
          errors.name = "Por favor, ingresa un nombre y apellido.";
        } else if (!/^[a-zA-ZÀ-ÿ\s]{1,25}$/.test(values.name)) {
          errors.name = "Solo deben ingresarse letras o espacios.";
        }

        // ERROR TELEFONO
        if (!values.phone) {
          errors.phone = "Por favor, ingresa un número de teléfono.";
        } else if (
          !/^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/.test(
            values.phone
          )
        ) {
          errors.phone = "El número no es válido.";
        }

        // ERROR EMAIL
        if (!values.email) {
          errors.email = "Por favor, ingresa un email.";
        } else if (
          //eslint-disable-next-line
          !/^(([^<>()[\].,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
            values.email
          )
        ) {
          errors.email = "El email no es válido.";
        }

        // ERROR PROVINCIA
        if (!values.province) {
          errors.province = "Por favor, ingresa una provincia.";
        } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.province)) {
          errors.province = "Solo deben ingresarse letras o espacios.";
        }

        // ERROR PROVINCIA
        if (!values.location) {
          errors.location = "Por favor, ingresa una localidad.";
        } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.location)) {
          errors.location = "Solo deben ingresarse letras o espacios.";
        }

        // ERROR PROVINCIA
        if (!values.street) {
          errors.street = "Por favor, ingresa una calle.";
        } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.street)) {
          errors.street = "Solo deben ingresarse letras o espacios.";
        }

        // ERROR NÚMERO DE CALLE
        if (!values.number) {
          errors.number = "Por favor, ingresa el número de la calle.";
        } else if (!/^[0-9]{1,5}$/.test(values.number)) {
          errors.number = "El número no es valido.";
        }

        // ERROR CODIGO POSTAL
        if (!values.postal) {
          errors.postal = "Por favor, ingresa el codigo postal.";
        } else if (!/^[0-9]{1,4}$/.test(values.postal)) {
          errors.postal = "El codigo postal no es valido.";
        }

        return errors;
      }}
      onSubmit={(values, { resetForm }) => {
        // objeto con los items y datos del usuario
        const newOrder = {
          buyer: {
            name: values.name,
            phone: values.phone,
            email: values.email,
            province: values.province,
            location: values.location,
            street: values.street,
            numberStreet: values.number,
            postalCode: values.postal,
          },
          items: itemsCarrito,
          total: getTotal(),
        };
        setOrderData(newOrder);
        resetForm();
        sendOrder(newOrder);
        setFormSend(true);
      }}
    >
      {({ errors }) => (
        <Form className="container-fluid">
          {length ? (
            <div>
              {!formSend ? (
                <div>
                  <div>
                    {/* TITULO */}
                    <h4 className="FinalBuy">Finalizar Compra:</h4>

                    <p className="BuyerDataParagraph">
                      Por favor, ingresá los datos del destinatario.
                    </p>

                    {/* FORMULARIO */}
                    <div className="Form col-lg-6 col-md-8 col-sm-12 mx-auto">
                      <div className="FormFlex">
                        <label className="DataReq">
                          <span>(*)</span> Nombre Y Apellido
                        </label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          autoComplete="on"
                          className="Label"
                        />
                        <ErrorMessage
                          name="name"
                          component={() => (
                            <div className="Error">{errors.name}</div>
                          )}
                        />
                      </div>

                      {/* Telefono */}
                      <div className="FormFlex">
                        <label className="DataReq">
                          <span>(*)</span> Telefono
                        </label>
                        <Field
                          type="number"
                          id="phone"
                          name="phone"
                          autoComplete="on"
                          className="Label"
                          placeholder="351 152525252"
                        />
                        <ErrorMessage
                          name="phone"
                          component={() => (
                            <div className="Error">{errors.phone}</div>
                          )}
                        />
                      </div>

                      {/* Email */}

                      <div className="FormFlex">
                        <label className="DataReq">
                          <span>(*)</span> Email
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          autoComplete="on"
                          className="Label"
                          placeholder="staylo@gmail.com"
                        />
                        <ErrorMessage
                          name="email"
                          component={() => (
                            <div className="Error">{errors.email}</div>
                          )}
                        />
                      </div>
                      {/* Estado/Provincia */}
                      <div className="FormFlex">
                        <label className="DataReq">
                          <span>(*)</span> Provincia
                        </label>
                        <Field
                          type="text"
                          id="province"
                          name="province"
                          autoComplete="on"
                          className="Label"
                          placeholder="Córdoba"
                        />
                        <ErrorMessage
                          name="province"
                          component={() => (
                            <div className="Error">{errors.province}</div>
                          )}
                        />
                      </div>
                      {/* Localidad */}
                      <div className="FormFlex">
                        <label className="DataReq">
                          <span>(*)</span> Localidad
                        </label>
                        <Field
                          type="text"
                          id="location"
                          name="location"
                          autoComplete="on"
                          className="Label"
                          placeholder="Córdoba"
                        />
                        <ErrorMessage
                          name="location"
                          component={() => (
                            <div className="Error">{errors.location}</div>
                          )}
                        />
                      </div>
                      {/* Calle */}
                      <div className="FormFlex">
                        <label className="DataReq">
                          <span>(*)</span> Calle
                        </label>
                        <Field
                          type="text"
                          id="street"
                          name="street"
                          autoComplete="on"
                          className="Label"
                          placeholder="Av. Colon"
                        />
                        <ErrorMessage
                          name="street"
                          component={() => (
                            <div className="Error">{errors.street}</div>
                          )}
                        />
                      </div>
                      {/* Numero de Calle */}
                      <div className="FormFlex">
                        <label className="DataReq">
                          <span>(*)</span> Número
                        </label>
                        <Field
                          type="number"
                          id="number"
                          name="number"
                          autoComplete="on"
                          className="Label"
                          placeholder="1234"
                        />
                        <ErrorMessage
                          name="number"
                          component={() => (
                            <div className="Error">{errors.number}</div>
                          )}
                        />
                      </div>
                      {/* Codigo Postal */}
                      <div className="FormFlex">
                        <label className="DataReq">
                          <span>(*)</span> Codigo Postal
                        </label>
                        <Field
                          type="number"
                          id="postal"
                          name="postal"
                          autoComplete="on"
                          className="Label"
                          placeholder="5000"
                        />
                        <ErrorMessage
                          name="postal"
                          component={() => (
                            <div className="Error">{errors.postal}</div>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* Pago */}
                  <div>
                    {/* Selectores de Pago */}
                    <div>
                      {/* Metodo de Pago */}
                      <div>
                        <div>
                          <p className="PaymenthParagraph">
                            <span>(*)</span> Metodo de Pago:
                          </p>
                          <p> {paymenthMethod} </p>
                        </div>

                        <div>
                          <div>
                            <p></p>
                            <Select
                              className="SelectForm"
                              defaultValue={{
                                label: "Seleccioná un metodo de pago",
                                value: "Tarjeta de débito",
                              }}
                              options={paymenths}
                              onChange={handleSelectChange}
                            />
                          </div>
                        </div>
                      </div>
                      {/* Datos de Facturación */}
                    </div>

                    {/* DNI */}

                    <hr />

                    {/* RESUMEN DE COMPRA */}
                    <div>
                      <div className="container row mx-auto ItemContainer">
                        {itemsCarrito.map((element) => (
                          <CartItem
                            key={element.item.id}
                            item={element.item}
                            quantity={element.quantity}
                            title={element.title}
                            price={element.price}
                          />
                        ))}
                      </div>
                      {/* TOTAL */}
                      <div className="FinalAmount">
                        <p>Monto final : ${getTotal()}</p>
                      </div>
                    </div>

                    {/* BOTON FINALIZAR COMPRA */}
                    <div className="ButtonFinalContainer">
                      <Button className="ButtonFinal" type="sumbit">
                        Finalizar Compra
                      </Button>
                      {formSend && (
                        <div className="exito">
                          <div className="resumen_de_compra">
                            <h4>¡Compra Exitosa!</h4>
                            <p className="number_order">
                              {" "}
                              <span>Su código de orden es:</span> {orderId}
                            </p>
                            <hr className="linea_separativa" />
                            {/* datos del usuario */}
                            <div className="datos_buyer">
                              <p>
                                Nombre: <span>{orderData.buyer.name}</span>
                              </p>
                              <p>
                                Telefono: <span>{orderData.buyer.phone}</span>
                              </p>
                              <p>
                                Email: <span>{orderData.buyer.email}</span>
                              </p>
                              <p>
                                Provincia:{" "}
                                <span>{orderData.buyer.province}</span>
                              </p>
                              <p>
                                Localidad:{" "}
                                <span>{orderData.buyer.location}</span>
                              </p>
                              <p>
                                Calle: <span>{orderData.buyer.street}</span>
                              </p>
                              <p>
                                Numero:{" "}
                                <span>{orderData.buyer.numberStreet}</span>
                              </p>
                              <p>
                                Codigo Postal:{" "}
                                <span>{orderData.buyer.postalCode}</span>
                              </p>
                            </div>
                            <hr className="linea_separativa" />
                            <div className="datos_buyer">
                              <p>
                                Total: <span>${orderData.total}</span>
                              </p>
                            </div>
                          </div>
                          <div className="seguir_comprando_contenedor">
                            <Link to="/products" className="seguir_comprando">
                              Seguir Comprando
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {formSend && (
                    <div className="exito">
                      <div className="resumen_de_compra">
                        <h4>¡Compra Exitosa!</h4>
                        <p className="number_order">
                          {" "}
                          <span>Su código de orden es:</span> {orderId}
                        </p>
                        <hr className="linea_separativa" />
                        {/* datos del usuario */}
                        <div className="datos_buyer">
                          <p>
                            Nombre: <span>{orderData.buyer.name}</span>
                          </p>
                          <p>
                            Telefono: <span>{orderData.buyer.phone}</span>
                          </p>
                          <p>
                            Email: <span>{orderData.buyer.email}</span>
                          </p>
                          <p>
                            Provincia: <span>{orderData.buyer.province}</span>
                          </p>
                          <p>
                            Localidad: <span>{orderData.buyer.location}</span>
                          </p>
                          <p>
                            Calle: <span>{orderData.buyer.street}</span>
                          </p>
                          <p>
                            Numero: <span>{orderData.buyer.numberStreet}</span>
                          </p>
                          <p>
                            Codigo Postal:{" "}
                            <span>{orderData.buyer.postalCode}</span>
                          </p>
                        </div>
                        <hr className="linea_separativa" />
                        <div className="datos_buyer">
                          <p>
                            Total: <span>${orderData.total}</span>
                          </p>
                        </div>
                      </div>
                      <div className="seguir_comprando_contenedor">
                        <Link to="/products" className="seguir_comprando">
                          Seguir Comprando
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="EmptyCart">
              <p className=" OffCanvasP EmptyCartP">
                El carrito de compras se encuentra vacio
              </p>
              <Link className="AddMoreProducts" to="/products">
                <Button variant="dark">Agregar Productos</Button>
              </Link>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

//        EXPORTACIÓN
export default BuyForm;
