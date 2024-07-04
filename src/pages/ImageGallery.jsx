import React, { useState, useEffect } from "react";
import "./ImageGallery.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ImageWithPlaceholder from "../components/ImageWithPlaceholder";
import ScrollAnimation from "../components/ScrollAnimation";
import placeholder from "../assets/images/placeholder-image.png";
import { storage } from "../firebaseConfig";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { responsive } from "../components/Academics";
import { useNavigate } from "react-router-dom";

const ImageGallery = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const [academics, setAcademics] = useState(false);
  const [extracurricular, setExtracurricular] = useState(false);
  const [programs, setPrograms] = useState(false);
  const [workshops, setWorkshops] = useState(false);

  const [loadedImages, setLoadedImages] = useState({
    academics: [],
    extracurricular: [],
    programs: [],
    workshops: [],
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    listAll(ref(storage, "uploads")).then((res) => {
      const promises = res.items.map((item) => {
        return getDownloadURL(item).then((url) => {
          return { id: item.name, url };
        });
      });

      Promise.all(promises).then((results) => {
        const newImages = {
          academics: [],
          extracurricular: [],
          programs: [],
          workshops: [],
        };

        results.forEach(({ id, url }) => {
          if (id.includes("academics")) {
            newImages.academics.push({ id, url });
          } else if (id.includes("extracurricular")) {
            newImages.extracurricular.push({ id, url });
          } else if (id.includes("programs")) {
            newImages.programs.push({ id, url });
          } else if (id.includes("workshops")) {
            newImages.workshops.push({ id, url });
          }
        });

        setLoadedImages(newImages);
      });
    });
  };

  const GenerateImages = ({ images }) => {
    return (
      <div className="all-image-section">
        {images.map((image, index) => (
          <ImageWithPlaceholder
            key={index}
            src={image.url}
            placeholder={placeholder}
            alt={`image${index}`}
            className="all-image"
          />
        ))}
      </div>
    );
  };

  const handleOpenSection = (setter) => {
    setter(true);
  };

  return (
    <div className="gallery-page">
      {/* Academics Section */}

      <ScrollAnimation direction="bottomToTop">
        <div className="images-section">
          <div className="service-title">Academics</div>
          {isLoggedIn && (
            <div className="edit-gallery-box">
              <div
                onClick={() => navigate("/editGallery")}
                className="edit-galley-text"
              >
                {`Edit Gallery`}
              </div>
            </div>
          )}
          {!loadedImages.academics.length ? (
            <div className="loading-box">
              {" "}
              <p className="loading"></p>
            </div>
          ) : (
            !academics && (
              <Carousel showDots={true} responsive={responsive}>
                {loadedImages.academics.slice(0, 10).map((image, index) => (
                  <div key={index} className="about-image-div-gallery">
                    <ImageWithPlaceholder
                      src={image.url}
                      placeholder={placeholder}
                      className="about-image"
                    />
                  </div>
                ))}
                {loadedImages.workshops.length > 15 && (
                  <div className="view-more-section">
                    {loadedImages.academics
                      .slice(10, 13)
                      .map((image, index) => (
                        <ImageWithPlaceholder
                          key={index}
                          src={image.url}
                          placeholder={placeholder}
                          className="view-more-image"
                        />
                      ))}
                    <div className="blur-box">
                      <ImageWithPlaceholder
                        src={loadedImages.academics[14].url}
                        placeholder={placeholder}
                        className="blur-image"
                      />
                      <div
                        className="view-more-text"
                        onClick={() => handleOpenSection(setAcademics)}
                      >
                        View More..
                      </div>
                    </div>
                  </div>
                )}
              </Carousel>
            )
          )}
          {academics && <GenerateImages images={loadedImages.academics} />}
        </div>
      </ScrollAnimation>

      {/* Extracurricular Section */}
      <ScrollAnimation direction="bottomToTop">
        <div className="images-section">
          <div className="service-title">Extracurricular</div>
          {!loadedImages.extracurricular.length ? (
            <div className="loading-box">
              {" "}
              <p className="loading"></p>
            </div>
          ) : (
            !extracurricular && (
              <Carousel showDots={true} responsive={responsive}>
                {loadedImages.extracurricular
                  .slice(0, 10)
                  .map((image, index) => (
                    <div key={index} className="about-image-div-gallery">
                      <ImageWithPlaceholder
                        src={image.url}
                        placeholder={placeholder}
                        className="about-image"
                      />
                    </div>
                  ))}
                {loadedImages.extracurricular.length > 15 && (
                  <div className="view-more-section">
                    {loadedImages.extracurricular
                      .slice(10, 13)
                      .map((image, index) => (
                        <ImageWithPlaceholder
                          key={index}
                          src={image.url}
                          placeholder={placeholder}
                          className="view-more-image"
                        />
                      ))}
                    <div className="blur-box">
                      <ImageWithPlaceholder
                        src={loadedImages.extracurricular[14].url}
                        placeholder={placeholder}
                        className="blur-image"
                      />
                      <div
                        className="view-more-text"
                        onClick={() => handleOpenSection(setExtracurricular)}
                      >
                        View More..
                      </div>
                    </div>
                  </div>
                )}
              </Carousel>
            )
          )}
          {extracurricular && (
            <GenerateImages images={loadedImages.extracurricular} />
          )}
        </div>
      </ScrollAnimation>

      {/* Programs Section */}
      <ScrollAnimation direction="bottomToTop">
        <div className="images-section">
          <div className="service-title">Programs</div>
          {!loadedImages.programs.length ? (
            <div className="loading-box">
              {" "}
              <p className="loading"></p>
            </div>
          ) : (
            !programs && (
              <Carousel showDots={true} responsive={responsive}>
                {loadedImages.programs.slice(0, 10).map((image, index) => (
                  <div key={index} className="about-image-div-gallery">
                    <ImageWithPlaceholder
                      src={image.url}
                      placeholder={placeholder}
                      className="about-image"
                    />
                  </div>
                ))}
                {loadedImages.programs.length > 15 && (
                  <div className="view-more-section">
                    {loadedImages.programs.slice(10, 13).map((image, index) => (
                      <ImageWithPlaceholder
                        key={index}
                        src={image.url}
                        placeholder={placeholder}
                        className="view-more-image"
                      />
                    ))}
                    <div className="blur-box">
                      <ImageWithPlaceholder
                        src={loadedImages.programs[14].url}
                        placeholder={placeholder}
                        className="blur-image"
                      />
                      <div
                        className="view-more-text"
                        onClick={() => handleOpenSection(setPrograms)}
                      >
                        View More..
                      </div>
                    </div>
                  </div>
                )}
              </Carousel>
            )
          )}
          {programs && <GenerateImages images={loadedImages.programs} />}
        </div>
      </ScrollAnimation>

      {/* Workshops & Events Section */}
      <ScrollAnimation direction="bottomToTop">
        <div className="images-section">
          <div className="service-title">Workshops & Events</div>
          {!loadedImages.workshops.length ? (
            <div className="loading-box">
              {" "}
              <p className="loading"></p>
            </div>
          ) : (
            !workshops && (
              <Carousel showDots={true} responsive={responsive}>
                {loadedImages.workshops.slice(0, 10).map((image, index) => (
                  <div key={index} className="about-image-div-gallery">
                    <ImageWithPlaceholder
                      src={image.url}
                      placeholder={placeholder}
                      className="about-image"
                    />
                  </div>
                ))}
                {loadedImages.workshops.length > 15 && (
                  <div className="view-more-section">
                    {loadedImages.workshops
                      .slice(10, 13)
                      .map((image, index) => (
                        <ImageWithPlaceholder
                          key={index}
                          src={image.url}
                          placeholder={placeholder}
                          className="view-more-image"
                        />
                      ))}
                    <div className="blur-box">
                      <ImageWithPlaceholder
                        src={loadedImages.workshops[14].url}
                        placeholder={placeholder}
                        className="blur-image"
                      />
                      <div
                        className="view-more-text"
                        onClick={() => handleOpenSection(setWorkshops)}
                      >
                        View More..
                      </div>
                    </div>
                  </div>
                )}
              </Carousel>
            )
          )}
          {workshops && <GenerateImages images={loadedImages.workshops} />}
        </div>
      </ScrollAnimation>

      {/* Videos Section */}
    </div>
  );
};

export default ImageGallery;
