
export function swapInArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
}
export function getImageSize(galleryWidth) {
    const TARGET_SIZE = 200;
    const imagesPerRow = Math.floor(galleryWidth / TARGET_SIZE);
    return (galleryWidth / imagesPerRow);
}