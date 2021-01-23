import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import ReactModal from 'react-modal';
import './Gallery.scss';
import { getImageSize } from './../../api/helper';
import {
  CSSTransition,
  TransitionGroup
} from 'react-transition-group';
const ROTATE_ANGLE = 90;


class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: 1000,
      showModal: false,
      urlModalImage: '',
      rotateModalImage: 0,
      loading: true,
      page: 0, //last uploaded page
      prevY: 0,
      indexDroped: -1,
      imageDroped: {},
      tempIndex: -1
    };
  }


  getImages(tag, page, load) {
    if (load) {
      if (!this.state.loading) this.setState({ loading: true });
      const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&nojsoncallback=1&page=${page}`;
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
            const imagesArr = res.photos.photo.map(photo => Object.assign({ ...photo, rotate: 0, page: page, temp: '' }));
            this.setState({ images: [...this.state.images, ...imagesArr], loading: false, page: page }, () => { this.updateWidth() });
          }
        });
    }
  }

  componentDidMount() {
    this.getImages(this.props.tag, this.state.page + 1, this.props.load);
    window.addEventListener('resize', () => this.updateWidth());

    var options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    };

    this.observer = new IntersectionObserver(
      this.handleObserver,
      options
    );
    this.observer.observe(this.loadingRef);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', () => this.updateWidth());
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  updateWidth() {
    const newWidth = document.body.clientWidth;
    if (newWidth != this.state.galleryWidth) {
      this.setState({
        galleryWidth: newWidth
      });
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ images: [], page: 0, prevY: 0, loading: true }, this.getImages(props.tag, 1, props.load));
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleRotate = (index, image) => {
    const images = [...this.state.images];
    images[index].rotate = (images[index].rotate + ROTATE_ANGLE);
    this.setState({ images });
  }

  handleDelete = (index, image) => {
    const images = [...this.state.images];
    images.splice(index, 1);
    this.setState({ images });
  }

  handleExpand = (urlModalImage, rotateModalImage) => {
    this.setState({ urlModalImage, rotateModalImage });
    this.handleOpenModal();
  }

  handleObserver = (entities, observer) => {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y && !this.state.loading) {
      this.getImages(this.props.tag, this.state.page + 1, this.props.load);
    }
    this.setState({ prevY: y });
  }

  handleDragStart = (index, image) => {
    this.setState({ indexDroped: index, imageDroped: { ...image, temp: 'temp' } });
  };

  handleDrop = (index, image) => {
    const images = [...this.state.images];
    images[index].temp = '';
    this.setState({ indexDroped: -1, imageDroped: {}, images, tempIndex: -1 })
  };

  handleDragOver = (index, image) => {
    const images = [...this.state.images];

    if ((index !== this.state.indexDroped || this.state.tempIndex > -1) && index !== this.state.tempIndex) {
      if (this.state.tempIndex == -1) {
        if (this.state.indexDroped < index) {
          images.splice(this.state.indexDroped, 1);
          images.splice(index, 0, this.state.imageDroped);
        }
        else {
          images.splice(index, 0, this.state.imageDroped);
          images.splice(this.state.indexDroped + 1, 1);

        }
      }
      else {
        if (index > this.state.tempIndex) {
          images.splice(index + 1, 0, this.state.imageDroped);
          images.splice(this.state.tempIndex, 1);
        }
        else {
          images.splice(this.state.tempIndex, 1);
          images.splice(index, 0, this.state.imageDroped);
        }
      }
      this.setState({ images, tempIndex: index });

    }

  }

  render() {
    return (
      <div className="gallery-root" id="gallery-root">

        <ReactModal
          isOpen={this.state.showModal}
          onRequestClose={this.handleCloseModal}
          className="gallery-modal-main"
          overlayClassName="gallery-modal-overlay"
          contentLabel="Expanded image in Modal"
        >
          <img className='gallery-modal-img' src={this.state.urlModalImage} alt='big-modal' style={{
            transform: `rotate(${this.state.rotateModalImage}deg)`
          }} />
        </ReactModal>
        <TransitionGroup className="todo-list">

          {this.state.images.map((dto, index) => {
            //Flickr API returns duplicated images on diffrent pages - see summary
            //For resolving non-unique keys problem I used number of page in key
            return (
              <CSSTransition
                key={'image-' + dto.page + '-' + dto.id + dto.temp}
                timeout={300}
                classNames="item"
              ><Image key={'image-' + dto.page + '-' + dto.id + dto.temp} dto={dto} size={getImageSize(this.state.galleryWidth)} index={index}
                onRotate={this.handleRotate} onDelete={this.handleDelete} onExpand={this.handleExpand}
                onDragStart={this.handleDragStart} onDrop={this.handleDrop} onDragOver={this.handleDragOver} /></CSSTransition>);
          })}
        </TransitionGroup>
        <div
          className='gallery-loading'
          ref={loadingRef => (this.loadingRef = loadingRef)}
        >
          {this.state.loading && <span >Loading...</span>}
        </div>
      </div>

    );
  }
}

export default Gallery;
