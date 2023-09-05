import React, { useState } from 'react';
import { faBaseballBall, faBasketballBall, faCar, faFootballBall, faFutbol, faGamepad, faGlobe, faGolfBall, faHockeyPuck, faListAlt, faRandom, faTableTennis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { truncatedText } from 'utils/helpers';
import InfiniteCarousel from 'react-leaf-carousel';
import { faPagelines } from '@fortawesome/free-brands-svg-icons';

const CategoryCarousel = ({ onCategorySelected }) => {
  const categories = [
    { label: 'Todos', icon: faRandom, slug: 'all' },
    { label: 'Baloncesto', icon: faBasketballBall, slug: 'basketball' },
    { label: 'Béisbol', icon: faBaseballBall, slug: 'baseball' },
    { label: 'Fútbol', icon: faFutbol, slug: 'soccer' },
    { label: 'Hockey sobre hielo', icon: faHockeyPuck, slug: 'hockey' },
    { label: 'Americano', icon: faFootballBall, slug: 'american_football' },
    { label: 'Golf', icon: faGolfBall, slug: 'golf' },
    { label: 'Tenis', icon: faTableTennis, slug: 'tennis' },
    { label: 'Otros', icon: faListAlt, slug: 'other' }
  ];

  const handleCategoryClick = (category, e) => {
    onCategorySelected(category.slug);
    // Remove the 'selected' class from all elements
    const carouselContentElements = document.querySelectorAll('.carousel-content');
    carouselContentElements.forEach((element) => {
      element.classList.remove('selected');
    });
    // Add the 'selected' class to the clicked element
    e.currentTarget.classList.add('selected');
  };

  return (
    <div className="carousel-container text-center py-2">
      <InfiniteCarousel
        dots={false}
        arrows={false}
        showSides={true}
        sidesOpacity={0.5}
        sideSize={0.1}
        slidesToScroll={2}
        slidesToShow={4}
        scrollOnDevice={true}
      >
        {categories.map((category, index) => (
          <div key={index} className={`carousel-slide my-2`}>
            <div
              className={`carousel-content ${category.slug === 'all' ? 'selected': ''}`}
              onClick={(e) => handleCategoryClick(category, e)}
            >
              <FontAwesomeIcon className="category-icon mb-2" icon={category.icon} />
              <span className="category-label">{truncatedText(category.label, 6)}</span>
            </div>
          </div>
        ))}
      </InfiniteCarousel>
    </div>
  );
};

export default CategoryCarousel;