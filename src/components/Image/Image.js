import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

function Image(props) {
  function urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  const onDragStart = () => {
    props.onDragStart(props.index, props.dto);
  };
  const onDragOver = (event) => {
    event.preventDefault();
    props.onDragOver(props.index);
  };

  return (
    <div
      className={'image-root ' + (props.dto.temp)}
      onDragStart={(event) => onDragStart(event)}
      onDragOver={(event) => onDragOver(event)}
      onDrop={() => props.onDrop(props.index)}
      draggable
      style={{
        backgroundImage: `url(${urlFromDto(props.dto)})`,
        width: props.size + 'px',
        height: props.size + 'px',
        transform: `rotate(${props.dto.rotate}deg)`
      }}
    >
      <div style={{
        transform: `rotate(${-props.dto.rotate}deg)` //reverse rotation for child
      }}>
        <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={() => props.onRotate(props.index)} />
        <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={() => props.onDelete(props.index)} />
        <FontAwesome className="image-icon" name="expand" title="expand" onClick={() => props.onExpand(urlFromDto(props.dto), props.dto.rotate)} />
      </div>
    </div>
  );

}

Image.propTypes = {
  dto: PropTypes.object,
  size: PropTypes.number,
  index: PropTypes.number,
  onRotate: PropTypes.func,
  onDelete: PropTypes.func,
  onExpand: PropTypes.func,
  onDragStart: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func
}
export default Image;
