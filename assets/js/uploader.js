/**
 * Created by QiuHuang on 2018/9/12.
 */
(function($){
    $.fn.uploaderExt = function(opt){
        var $target = $(this),
            targetId = $(this).attr('id'),
            $filesBox = $(this).closest('.file-item-box');
        var total = 0, error = 0;
        if (!targetId) {
            return false;
        }
        opt = $.extend({
            swf: '../plugins/WebUploader/Uploader.swf',
            server: 'http://webuploader.duapp.com/server/fileupload.php',
            auto: false,
            pick: {
                id: '#' + targetId,
                multiple: true
            },
            accept: {
                title: 'Images',
                extensions: 'jpg,jpeg,png',
                mimeTypes: 'image/jpg,image/jpeg,image/png'
            },
            prepareNextFile: true,
            compress: false,
            duplicate: false,
            fileNumLimit: 10,
            fileSingleSizeLimit: 20 * 1024 * 1024, //单张图片不超过20M
            // 以下为自定义参数
            triggerObj: opt.triggerObj,
            params: opt.params
        }, opt);
        var uploader = WebUploader.create(opt);

        // 触发上传按钮
        if(opt.triggerObj){
            opt.triggerObj.on('click', function () {
                if(opt.params){
                    uploader.option('formData', opt.params);
                }
                uploader.upload();
            });
        }
        
        // 当有文件被添加进队列的时候
        uploader.on('fileQueued', function (file) {
            var $fileItem = $(`<div class="file-item" data-id="${file.id}"><div class="img-thumb" title="${file.name}"></div><i class="remove">－</i></div>`);
            $target.before($fileItem);
            var $imgThumb = $fileItem.find('.img-thumb'),
                $removeBtn = $fileItem.find('.remove');
            total++;
            total>=opt.fileNumLimit ? $target.hide() : $target.show();

            // 创建文件缩略图
            uploader.makeThumb(file, function (error, src) {
                if (error) {
                    $imgThumb.text('无法预览');
                } else {
                    var $img = $(`<img src="${src}" />`);
                    $imgThumb.empty().append($img);
                }
            });

            //删除图片
            $removeBtn.on('click', function () {
                var $targetItem = $(this).closest('.file-item'),
                    fileId = $targetItem.attr('data-id');
                uploader.removeFile(fileId, true);
                $targetItem.remove();
                total--;
                $target.show();
            });
        });

        // 当某个文件的分块在发送前触发
        uploader.on('uploadBeforeSend', function (object, data, headers) {
            headers['X-Requested-With'] = 'XMLHttpRequest';
            var file = object.file;
            data.name = file.name.split('.' + file.ext)[0];
        });

        // 当开始上传流程时触发
        uploader.on('startUpload', function () {

        });

        // 当文件上传成功时
        uploader.on('uploadSuccess', function (file) {
            if(opt.uploadSuccessCallback){
                opt.uploadSuccessCallback();
            }
        });

        // 当文件上传失败时
        uploader.on('uploadError', function (file, reason) {
            uploader.removeFile(file.id);
            $filesBox.find(`[data-id="${file.id}"]`).remove();
            total--;
            error++;
            $target.show();
            if(opt.uploadErrorCallback){
                opt.uploadErrorCallback(file, reason);
            }
        });

        // 不管成功或者失败，文件上传完成时触发
        uploader.on('uploadComplete', function(file){
            if(opt.uploadCompleteCallback){
                opt.uploadCompleteCallback();
            }
        });

        // 当所有文件上传结束时触发
        uploader.on('uploadFinished', function(){
            if(opt.uploadFinishedCallback){
                opt.uploadFinishedCallback(error);
            }
        });

        // 当用户上传的文件验证不通过(不符合要求时)
        uploader.on('error', function (errorCode) {
            switch (errorCode) {
                case 'Q_TYPE_DENIED':
                    opt.errorMsg && opt.errorMsg.Q_TYPE_DENIED ? opt.errorMsg.Q_TYPE_DENIED() : alert(`当前只支持${opt.accept.extensions}类型图片！`);
                    break;              
                case 'F_EXCEED_SIZE':
                    opt.errorMsg && opt.errorMsg.F_EXCEED_SIZE ? opt.errorMsg.F_EXCEED_SIZE() : alert(`单张图片最大不能超过${opt.fileSingleSizeLimit / (1024 * 1024)}M！`);
                    break;
                case 'Q_EXCEED_NUM_LIMIT':
                    opt.errorMsg && opt.errorMsg.Q_EXCEED_NUM_LIMIT ? opt.errorMsg.Q_EXCEED_NUM_LIMIT() : alert(`最多只能上传${opt.fileNumLimit}张！`);   
                    break;
                case 'F_DUPLICATE':
                    opt.errorMsg && opt.errorMsg.F_DUPLICATE ? opt.errorMsg.F_DUPLICATE() : alert(`图片已被选择！`); 
                    break;
                default:
                    alert(`文件错误\n${errorCode}`); 
                    break;
            }
        });
        return uploader;
    }
})(jQuery);