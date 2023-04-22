import React, { useState } from 'react';
import { faBaseballBall, faBasketballBall, faCar, faFootballBall, faFutbol, faGamepad, faGlobe, faGolfBall, faHockeyPuck, faRandom, faTableTennis} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { truncatedText } from 'utils/helpers';
import InfiniteCarousel from 'react-leaf-carousel';
import { faPagelines } from '@fortawesome/free-brands-svg-icons';


const CategoryCarousel = ({ onCategorySelected }) => {
  const [currentCategory, setCurrentCategory] = useState(null);
  const categories = [
    { label: 'Todos', icon: faRandom, slug: 'all' },
    { label: 'Baloncesto', icon: faBasketballBall, slug: 'basketball' },
    { label: 'Béisbol', icon: faBaseballBall, slug: 'baseball' },
    { label: 'Fútbol', icon: faFutbol, slug: 'soccer' },
    { label: 'Hockey sobre hielo', icon: faHockeyPuck, slug: 'hockey' },
    { label: 'Americano', icon: faFootballBall , slug: 'american_football'},
    { label: 'Golf', icon: faGolfBall, slug: 'golf'},
    { label: 'Formula 1', icon: faCar, slug: 'formula_1'},
    { label: 'E-Sports', icon: faGamepad, slug: 'e_sports'},  
    { label: 'Tenis', icon: faTableTennis, slug: 'tennis'},
  ];

  const itemsPerSlide = 1;

  return (
    <div className="carousel-container text-center py-2">
        {/* <span className="text-muted px-4 ">{`-`}</span> */}
        <InfiniteCarousel
    dots={false}
    showSides={true}
    sidesOpacity={.5}
    sideSize={.1}
    slidesToScroll={2}
    slidesToShow={4}
    scrollOnDevice={true}
   
  >
        {Array.from({ length: Math.ceil(categories.length / itemsPerSlide) }).map((_, index) => (
          <div key={index} className="carousel-slide my-2">
            {categories.slice(index * itemsPerSlide, (index + 1) * itemsPerSlide).map((category, catIndex) => (
              <div key={catIndex} className={`carousel-content ${currentCategory ? 'active' : ''}`} onClick={() =>{
                setCurrentCategory(category.slug);
                 onCategorySelected(category.slug)
                 }}>
                <FontAwesomeIcon className="category-icon mb-2" icon={category.icon} />
                <span className="category-label">{truncatedText(category.label, 6)}</span>
              </div>
            ))}
          </div>
        ))}

  </InfiniteCarousel>
    </div>
  );
};

export default CategoryCarousel;