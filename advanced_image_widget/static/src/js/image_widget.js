/** @odoo-module **/

import { registry } from "@web/core/registry";
import { ImageField } from "@web/views/fields/image/image_field";
import { patch } from "@web/core/utils/patch";

patch(ImageField.prototype, {
    onEyeClick() {
        const imageSrc = this.getUrl(this.props.name);
        if (!imageSrc) return;

        const modal = document.createElement("div");
        modal.className = "custom-image-modal";
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" title="Close">&times;</span>
                <div class="zoom-controls">
                    <button class="zoom-in-btn" title="Zoom In"><i class="fa fa-search-plus"></i></button>
                    <button class="zoom-out-btn" title="Zoom Out"><i class="fa fa-search-minus"></i></button>
                    <button class="zoom-reset-btn" title="Reset Zoom"><i class="fa fa-refresh"></i></button>
                    <button class="crop-start-btn" title="Crop"><i class="fa fa-crop"></i></button>
                    <button class="crop-done-btn" title="Done" style="display: none;"><i class="fa fa-check"></i> Done</button>
                </div>
                <div class="preview-image-container">
                    <img id="crop-image" src="${imageSrc}" class="preview-image" />
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const img = modal.querySelector("#crop-image");
        const container = modal.querySelector(".preview-image-container");

        let zoom = 1;
        let cropper = null;
        let isCropping = false;

        const setZoom = () => {
            if (cropper) {
                cropper.zoomTo(zoom);
            } else {
                img.style.width = `${zoom * 100}%`;
                img.style.height = "auto";
            }
        };

        modal.querySelector(".zoom-in-btn").onclick = () => {
            zoom = Math.min(3, zoom + 0.1);
            setZoom();
        };

        modal.querySelector(".zoom-out-btn").onclick = () => {
            zoom = Math.max(0.3, zoom - 0.1);
            setZoom();
        };

        modal.querySelector(".zoom-reset-btn").onclick = () => {
            zoom = 1;
            if (cropper) {
                cropper.zoomTo(zoom);
            } else {
                img.style.removeProperty("width");
                img.style.removeProperty("height");
            }
        };

        modal.querySelector(".crop-start-btn").onclick = () => {
            const doneBtn = modal.querySelector(".crop-done-btn");

            if (!isCropping) {
                cropper = new Cropper(img, {
                    viewMode: 0,
                    dragMode: 'crop',
                    autoCropArea: 0.8,
                    background: false,
                    responsive: true,
                    modal: true,
                    guides: false,
                    highlight: false,
                    center: false,
                    cropBoxResizable: true,
                    cropBoxMovable: true,
                    zoomOnWheel: false,
                    ready() {
                        cropper.zoomTo(zoom);
                    },
                });

                isCropping = true;
                doneBtn.style.display = "block";
            } else {
                cropper.destroy();
                cropper = null;
                isCropping = false;
                doneBtn.style.display = "none";
                setZoom();
            }
        };

        modal.querySelector(".crop-done-btn").onclick = () => {
            if (!cropper) return;

            const canvas = cropper.getCroppedCanvas({
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });

            const base64 = canvas.toDataURL('image/png').split(',')[1];

            this.props.record.update({
                [this.props.name]: base64,
            });

            cropper.destroy();
            cropper = null;
            modal.remove();
        };

        modal.querySelector(".close-btn").onclick = () => {
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
            modal.remove();
        };
    }
});

export class ImageFieldWithPreview extends ImageField {}

registry.category("fields").add("image_preview", {
    ...registry.category("fields").get("image"),
    component: ImageFieldWithPreview,
});
