import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import ReactModal from 'react-modal';
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
      galleryWidth: 1000,
      showModal: false,
      urlImage: '',
      loading: false,
      page: 0, //last uploaded page
      prevY: 0
    };
  }


  getImages(tag, page) {
    this.setState({ loading: true });
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
          const imagesArr = res.photos.photo.map(photo => Object.assign({ ...photo, rotate: 0, page: page }));
          this.setState({ images: [...this.state.images, ...imagesArr], loading: false, page: page }, () => { this.updateWidth() });
        }
      });
  }

  componentDidMount() {
    this.getImages(this.props.tag, this.state.page + 1);
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
    this.setState({ images: [], page: 0, prevY: 0 }, this.getImages(props.tag, 1));

  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
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

  handleExpand = (urlImage) => {
    this.setState({ urlImage });
    this.handleOpenModal();
  }

  handleObserver = (entities, observer) => {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y && !this.state.loading) {
      this.getImages(this.props.tag, this.state.page + 1);
    }
    this.setState({ prevY: y });
  }

  getImageSize(galleryWidth) {
    const imagesPerRow = Math.floor(galleryWidth / TARGET_SIZE);
    return (galleryWidth / imagesPerRow);
  }

  render() {
    // Additional css
    const loadingCSS = {
      height: '100px',
      margin: '30px'
    };
    // const loadingTextCSS = { display: this.state.loading ? "block" : "none" };

    return (
      <div className="gallery-root" id="gallery-root">

        <ReactModal
          isOpen={this.state.showModal}
          onRequestClose={this.handleCloseModal}
          className="Modal"
          overlayClassName="Overlay"
          contentLabel="Expanded image in Modal"
        >
          <img className='img-modal' src={this.state.urlImage} alt='big-modal' />
        </ReactModal>

        {this.state.images.map(dto => {
          //Flickr API returns duplicated images on diffrent pages - see summary
          //For resolving non-unique keys problem I used number of page in key
          return <Image key={'image-' + dto.page + '-' + dto.id} dto={dto} size={this.getImageSize(this.state.galleryWidth)} onRotate={this.handleRotate} onDelete={this.handleDelete} onExpand={this.handleExpand} />;
        })}

        <div
          ref={loadingRef => (this.loadingRef = loadingRef)}
          style={loadingCSS}
        >
          {this.state.loading && <span >Loading...</span>}
        </div>
      </div>

    );
  }
}

export default Gallery;
