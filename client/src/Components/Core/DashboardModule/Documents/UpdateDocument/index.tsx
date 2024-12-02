import React, { FC, useState, useEffect } from "react";

import { Button, Modal, Input, Form, Upload, Spin } from "antd";
import {
  DeleteOutlined,
  PaperClipOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type {
  RcFile,
  UploadFile,
  UploadProps,
  UploadChangeParam,
} from "antd/es/upload/interface";
import { toast } from "react-toastify";

import useLanguage from "../../../../../Hooks/useLanguage";

import { updateDocument } from "../../../../../Network/Core/document";

//  helper
import {
  allowedFileExtensions,
  errorHandling,
  maxDocSizeInMB,
  validateFileSize,
  validateFileType,
} from "../../../../../Library/Utils";

import {
  DocumentInfo,
  DocumentUpdatePayload,
} from "../../../../../types/document";

import { allowedDocumentExtenstions } from "../../../../../Resources/Statics";

interface UpdateDocumentInterface {
  documentInfo: DocumentInfo;
  dispatchUpdateDocument: (payload: DocumentUpdatePayload) => void;
}

const UpdateDocument: FC<UpdateDocumentInterface> = ({
  documentInfo,
  dispatchUpdateDocument,
}) => {
  const [showUploadedDocItem, setShowUploadedDocItem] = useState<boolean>(true);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [formDisabled, setFormDisabled] = useState<boolean>(false);

  const [form] = Form.useForm();

  const { convertText } = useLanguage();

  /**
   * Resets the document listing state and file list, effectively canceling any ongoing document editing operation.
   */
  const resetDocumentListing = () => {
    setFileList([]);
    dispatchUpdateDocument({
      isOpenEditDocumentModal: false,
      sortColumn: "",
      selectedStatuses: [""],
      currentPage: 1,
      callDocumentList: true,
    });
  };

  /**
   * Closes the edit document modal, resetting relevant state and form fields.
   */
  const closeEditDocumentModal = () => {
    dispatchUpdateDocument({
      isOpenEditDocumentModal: false,
    });
    setFileList([]);
    form.resetFields();
  };

  /**
   * Removes the uploaded document item from display.
   */
  const removeUploadedDoc = () => {
    setShowUploadedDocItem(false);
  };

  /**
   * Handles the uploading of a document, either via file upload or providing a link,
   * and updates the document accordingly.
   *
   * @param {Object} values - An object containing either the file to upload or a link to provide.
   * @param {UploadChangeParam<RcFile>} values.file - The file to upload (if uploading a file).
   * @param {string} values.link - The link to provide (if providing a link).
   */
  const handleUploadDocument = async (values: {
    file: UploadChangeParam<RcFile>;
    link: string;
  }) => {
    const { isFileUploaded } = documentInfo;
    const formData = new FormData();
    if (isFileUploaded) {
      if (fileList?.length === 0) {
        form.setFields([
          {
            name: "file",
            errors: [`${convertText("documentFileValidate")}`],
          },
        ]);
        return;
      }
      if (Object.prototype.hasOwnProperty.call(fileList[0], "url")) {
        closeEditDocumentModal();
        return;
      }
      formData.append("document_file", fileList[0] as RcFile);
    } else {
      const { link } = values;
      formData.append("link", link);
    }

    try {
      setFormDisabled(true);
      const response = await updateDocument(
        documentInfo.docIdForEdit,
        formData
      );
      if (response?.data?.success) {
        toast.success(convertText("successUpdateDocument"));
      }
    } catch (error) {
      errorHandling(error);
      form.resetFields();
    } finally {
      resetDocumentListing();
      setFormDisabled(false);
    }
  };

  useEffect(() => {
    const { isOpenEditDocumentModal, selectedDocumentLink } = documentInfo;
    if (isOpenEditDocumentModal) {
      form.setFieldsValue({
        link: selectedDocumentLink,
      });
      setShowUploadedDocItem(true);
    }
  }, [documentInfo.isOpenEditDocumentModal]);

  const props: UploadProps = {
    onRemove: () => {
      setFileList([]);
      form.setFieldsValue({ file: null });
    },
    beforeUpload: (file) => {
      const isAllowedType = validateFileType(file, allowedFileExtensions);
      if (!isAllowedType) {
        setFileList([]);
        toast.error(`${file.name} ${convertText("isNotAllowed")}`);
        return false;
      }
      const isAllowedFileSize = validateFileSize(file, maxDocSizeInMB);
      if (!isAllowedFileSize) {
        setFileList([]);
        toast.error(`${convertText("fileSizeExceedsMsg")} ${maxDocSizeInMB}MB`);
        return false;
      }
      form.setFields([
        {
          name: `file`,
          errors: [],
        },
      ]);
      setFileList([file]);

      return false;
    },
    fileList,
    accept: allowedDocumentExtenstions,
  };
  return (
    <div className="">
      <Modal
        title={`${
          documentInfo.isFileUploaded
            ? convertText("updateDocumentTitle")
            : convertText("updateLinkTitle")
        }`}
        centered
        open={documentInfo.isOpenEditDocumentModal}
        onOk={closeEditDocumentModal}
        onCancel={closeEditDocumentModal}
        className="common-modal task-modal"
        width={640}
        footer={null}
        destroyOnClose
        maskClosable={false}
      >
        <Spin spinning={formDisabled}>
          <Form onFinish={handleUploadDocument} form={form}>
            <div className="objective-step">
              {documentInfo.isFileUploaded && (
                <div className="Uploaded-document-box">
                  <h3>{convertText("uploadedDocument")}</h3>
                  <div className="uploaded-list">
                    {showUploadedDocItem && (
                      <div className="uploaded-list-item">
                        <PaperClipOutlined />
                        <span>
                          {documentInfo.selectedDocumentName || "doc"}
                        </span>
                        <Button onClick={removeUploadedDoc} type="text">
                          <DeleteOutlined />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <h3 className="step-sub-title">
                {documentInfo.isFileUploaded
                  ? convertText("selectDocument")
                  : convertText("documentLink")}
              </h3>
              {documentInfo.isFileUploaded ? (
                <div className="obj-desc document-update-box">
                  <Form.Item name="file">
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <Upload {...props}>
                      <Button icon={<UploadOutlined />}>
                        {convertText("selectFile")}
                      </Button>
                    </Upload>
                  </Form.Item>
                </div>
              ) : (
                <div className="obj-desc">
                  <Form.Item
                    name="link"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        type: "url",
                        message: `${convertText("linkValidate")}`,
                      },
                    ]}
                    initialValue={documentInfo.selectedDocumentLink}
                  >
                    <Input
                      size="large"
                      placeholder={convertText("documentLinkPlaceholder")}
                    />
                  </Form.Item>
                </div>
              )}
            </div>
            <div className="ant-modal-footer">
              <Button
                key="back"
                className="self-btn"
                onClick={closeEditDocumentModal}
                id="close-task-modal"
              >
                {convertText("cancelBtn")}
              </Button>
              <Button
                className="theme-btn"
                htmlType="submit"
                id="submit-add-task"
                disabled={formDisabled}
              >
                {documentInfo.isFileUploaded
                  ? convertText("updateDocumentTitle")
                  : convertText("updateLinkTitle")}
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default React.memo(UpdateDocument);
