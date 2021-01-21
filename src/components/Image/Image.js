import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
const TARGET_SIZE = 200;


function Image(props) {

  function getImageSize() {
    const { galleryWidth } = props;
    const imagesPerRow = Math.floor(galleryWidth / TARGET_SIZE);
    return (galleryWidth / imagesPerRow);
  }

  function urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  return (
    <div
      className="image-root"
      style={{
        backgroundImage: `url(${urlFromDto(props.dto)})`,
        width: getImageSize() + 'px',
        height: getImageSize() + 'px',
        transform: `rotate(${props.dto.rotate}deg)`
      }}
    >
      <div style={{
        transform: `rotate(${-props.dto.rotate}deg)` //reverse rotation for child
      }}>
        <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={() => props.onRotate(props.dto)} />
        <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={() => props.onDelete(props.dto)} />
        <FontAwesome className="image-icon" name="expand" title="expand" onClick={() => props.onExpand(props.dto)} />
      </div>
    </div>
  );

}


Image.propTypes = {
  dto: PropTypes.object,
  galleryWidth: PropTypes.number
}
export default Image;
