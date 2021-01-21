import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
const ROTATE_ANGLE = 90;

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: 1000
    };
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          const imagesArr = res.photos.photo.map(photo => Object.assign({ ...photo, rotate: 0 }));
          this.setState({ images: imagesArr }, () => { this.updateWidth() });
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    window.addEventListener('resize', () => this.updateWidth());
  }
  componentWillUnmount() {
    window.removeEventListener('resize', () => this.updateWidth());
  }

  updateWidth() {
    const newWidth = document.body.clientWidth;
    if (newWidth != this.state.galleryWidth) {
      this.setState({
        galleryWidth: newWidth
      });
    }
  };

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  render() {
    return (
      <div className="gallery-root" id="gallery-root">
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto} galleryWidth={this.state.galleryWidth} onRotate={this.handleRotate} onDelete={this.handleDelete} onExpand={this.handleExpand} />;
        })}
      </div>
    );
  }

  handleRotate = (image) => {
    const images = [...this.state.images];
    const index = images.indexOf(image);
    images[index].rotate = (images[index].rotate + ROTATE_ANGLE);
    this.setState({ images });
  }

  handleDelete = (image) => {
    const images = this.state.images.filter(dto => dto.id !== image.id);
    this.setState({ images });
  }

  handleExpand = (image) => {
  }
}

export default Gallery;
