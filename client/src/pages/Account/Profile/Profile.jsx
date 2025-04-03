import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import "./profile.css";
import { getProfile, EditProfileApi } from "../../../API/Api";
import defaultProfile from "../../../assets/image/Profile.png";
import { ProfileEditIcon } from "../../../assets/icon/icons";
import { useForm } from "react-hook-form";
const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await getProfile();
      if (response.status === 200) {
        setUser(response.data.info.user);
        setImage(response.data.info.user.image);
        setValue("name", response.data.info.user.name);
        setValue("phone_number", response.data.info.user.phone_number);
        setValue("email", response.data.info.user.email);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "image") {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await EditProfileApi(formData);

      if (response.status === 200) {
        setIsEdit(false);
        fetchUser();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="profile-page">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner style={{ color: "var(--color2)" }} />
        </div>
      ) : (
        <Container>
          <div className="profile-page-content">
            <span className="profile-page-content-title zen-dots">
              {isEdit ? "Edit Profile" : "My Profile"}
            </span>

            {isEdit ? (
              <>
                <Form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-100 d-flex flex-column"
                >
                  <div className="profile-page-edit-content-image">
                    <img
                      src={image ? image : defaultProfile}
                      alt="profile"
                      className="profile-page-content-image-img"
                    />
                    <button
                      type="button"
                      className="profile-page-edit-content-image-button"
                      onClick={handleButtonClick}
                    >
                      <ProfileEditIcon className="ProfileEditIcon" />
                    </button>
                    <Form.Control
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={(event) => {
                        setValue("image", event.target.files);
                        handleFileChange(event);
                      }}
                      accept=".png, .jpeg, .jpg"
                    />
                    {errors.image && (
                      <p className="text-danger k2d">{errors.image.message}</p>
                    )}
                  </div>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="text"
                      placeholder="Your Name"
                      {...register("name", {
                        required: "Name is required",
                      })}
                      className="profile-page-edit-content-input k2d"
                    />
                    {errors.name && (
                      <p className="text-danger k2d">{errors.name.message}</p>
                    )}
                  </Form.Group>
                  <div className="d-flex gap-3">
                    <Form.Group className="w-100">
                      <Form.Control
                        type="number"
                        placeholder="Your Phone no."
                        autoComplete="off"
                        maxLength={10}
                        {...register("phone_number")}
                        className="profile-page-edit-content-input k2d"
                      />
                      {errors.phone_number && (
                        <p className="text-danger k2d">
                          {errors.phone_number.message}
                        </p>
                      )}
                    </Form.Group>
                    <Form.Group className="w-100">
                      <Form.Control
                        type="email"
                        disabled
                        placeholder="Your Email"
                        style={{ cursor: "not-allowed" }}
                        {...register("email")}
                        className="profile-page-edit-content-input k2d"
                      />
                    </Form.Group>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="profile-page-content-button zen-dots btn-4"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </Form>
              </>
            ) : (
              <>
                <div className="profile-page-content-image">
                  <img
                    src={image ? image : defaultProfile}
                    alt="profile"
                    className="profile-page-content-image-img"
                  />
                </div>

                <span className="profile-page-content-name-text k2d">
                  {user?.name}
                </span>
                <span className="profile-page-content-email-text k2d">
                  {user?.email}
                </span>

                <button
                  onClick={() => setIsEdit(!isEdit)}
                  className="profile-page-content-button zen-dots btn-4"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </Container>
      )}
    </div>
  );
};

export default Profile;
