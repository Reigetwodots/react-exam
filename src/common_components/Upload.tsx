import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload'

type CustomUploadProps = {
    fileList: UploadFile[]
    uploadProps?: Partial<UploadProps>
}

export default function CustomUpload({ fileList, uploadProps }: CustomUploadProps) {
    const _props: UploadProps = {
        name: 'file',
        accept: '.jpg, .jpeg, .png',
        listType: 'picture-card',
        customRequest: () => { },
        maxCount: 1,
        ...(uploadProps || {}),
        onChange(info: UploadChangeParam) {
            uploadProps?.onChange?.(info)
        },
    }

    return (
        <Upload {..._props} fileList={fileList}>
            {fileList.length < (_props?.maxCount || 1) && (
                <div>
                    {false ? <LoadingOutlined /> : <PlusOutlined />}
                </div>
            )}
        </Upload>
    )
}
