# -*- coding: utf-8 -*-
{
    'name': "Advanced Image Widget",
    'summary': "Custom image widget with zoom, crop, and preview features.",
    'description': "Custom image widget with zoom, preview, and crop functionality support.",
    'category': 'User Interface',
    'version': '1.0',
    'depends': ['base', 'product'],
    'data': [
        'views/product_view.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'advanced_image_widget/static/src/lib/cropperjs/cropper.min.css',
            'advanced_image_widget/static/src/lib/cropperjs/cropper.min.js',
            'advanced_image_widget/static/src/js/image_widget.js',
            'advanced_image_widget/static/src/css/image_widget.css',
            'advanced_image_widget/static/src/xml/Image_Widget_Template.xml',
        ],
    },
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
}

