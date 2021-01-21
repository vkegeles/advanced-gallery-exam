import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';
const ROTATE_ANGLE = 90;
const TARGET_SIZE = 200;


class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: 0
    };
  }

  getImageSize() {
    const { galleryWidth } = this.state;
    const imagesPerRow = Math.floor(galleryWidth / TARGET_SIZE);
    return (galleryWidth / imagesPerRow);
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
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
          this.setState({ images: imagesArr });
        }
      });
  }

  componentDidMount() {
    this.setState({
      galleryWidth: document.body.clientWidth
    }); this.getImages(this.props.tag);
    window.addEventListener('resize', this.updateWidth);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
  }


  updateWidth = () => {
    this.setState({
      galleryWidth: document.body.clientWidth
    });
  };

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map(dto => {
          return <Image key={'image-' + dto.id} dto={dto} size={this.getImageSize()} onRotate={this.handleRotate} onDelete={this.handleDelete} onExpand={this.handleExpand} />;
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
