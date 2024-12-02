import React, { useState, FC } from "react";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button, Upload, Form, Input, Modal, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type {
  RcFile,
  UploadFile,
  UploadProps,
  UploadChangeParam,
} from "antd/es/upload/interface";

import { RootState } from "../../../../../Store/store";

import useOptions from "../../../../../Hooks/useOptions";
import useLanguage from "../../../../../Hooks/useLanguage";

import { addDocument } from "../../../../../Network/Core/document";

import {
  allowedFileExtensions,
  errorHandling,
  maxDocSizeInMB,
  validateFileSize,
  validateFileType,
} from "../../../../../Library/Utils";

import {
  DocumentInfo,
  DocumentOption,
  DocumentUpdatePayload,
} from "../../../../../types/document";

import {
  IndividualPlanningModuleEnum,
  allowedDocumentExtenstions,
} from "../../../../../Resources/Statics";

const { Option } = Select;

interface IAddDocument {
  documentInfo: DocumentInfo;
  dispatchUpdateDocument: (payload: DocumentUpdatePayload) => void;
  module?: string;
}

interface DocumentForm {
  title: string;
  priority: string;
  status: string;
  link: string;
  file: UploadChangeParam<RcFile>;
}

const AddDocument: FC<IAddDocument> = ({
  documentInfo,
  dispatchUpdateDocument,
  module,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedDocStatus, setSelectedDocStatus] = useState<string>("");
  const [formDisabled, setFormDisabled] = useState<boolean>(false);

  const { convertText } = useLanguage();
  const { documentPriorityOptions, documentStatusoptions } = useOptions();

  const [form] = Form.useForm();

  const { isOpenAddDocumentModal } = documentInfo;
  /**
   * Retrieves the selected responsible person's id, first name, and last name from the Redux store using the useSelector hook.
   *
   * @returns An object containing the selected responsible person's id, first name, and last name.
   */
  const { id: selectedResponsiblePersonId } = useSelector(
    (state: RootState) => state.planningReducer.selectedPerson
  );

  /**
   * Cancels the operation of adding a document, resetting relevant state and form fields.
   */
  const onCancelModal = () => {
    dispatchUpdateDocument({
      isOpenAddDocumentModal: false,
    });
    setSelectedPriority("");
    setSelectedDocStatus("");
    setFileList([]);
    form.resetFields();
  };

  /**
   * Resets the fields and state related to document management, effectively canceling any ongoing operation.
   */
  const resetField = () => {
    dispatchUpdateDocument({
      isOpenAddDocumentModal: false,
      sortColumn: "",
      selectedStatuses: [""],
      currentPage: 1,
      callDocumentList: true,
    });
    setSelectedPriority("");
    setSelectedDocStatus("");
    form.resetFields();
  };

  /**
   * Handles the process of adding a document, including form validation, data preparation,
   * and sending a request to add the document to the system.
   *
   * @param {DocumentForm} values - The values from the document form containing title, priority, status, and link.
   */
  const onAddDocument = async (values: DocumentForm) => {
    const { title, priority, status, link } = values;
    if (fileList?.length === 0 && !documentInfo?.addLink) {
      form.setFields([
        {
          name: "file",
          errors: [`${convertText("documentFileValidate")}`],
        },
      ]);
    } else {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("priority", priority);
      formData.append("status", status);

      // here i will add person_id if the module is document planning and selected person is available
      if (
        module === IndividualPlanningModuleEnum.DocumentPlanning &&
        selectedResponsiblePersonId
      ) {
        formData.append("owner", selectedResponsiblePersonId);
      }
      if (!documentInfo?.addLink) {
        formData.append("document_file", fileList[0] as RcFile);
      } else {
        formData.append("link", link);
      }
      try {
        setFormDisabled(true);
        const response = await addDocument(formData);
        if (response?.data?.success) {
          toast.success(convertText("successAddDocument"));
        }
      } catch (error) {
        errorHandling(error);
      } finally {
        resetField();
        setFileList([]);
        setFormDisabled(false);
      }
    }
  };

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
      setFileList([file]);

      return false;
    },
    fileList,
    accept: allowedDocumentExtenstions,
  };

  return (
    <Modal
      title={`${convertText("addDocument")}`}
      centered
      open={isOpenAddDocumentModal}
      onOk={() =>
        dispatchUpdateDocument({
          isOpenAddDocumentModal: false,
        })
      }
      onCancel={onCancelModal}
      className="common-modal task-modal"
      width={640}
      footer={null}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} onFinish={onAddDocument}>
        <div className="objective-step responsibility-step kpi-step process-form">
          {documentInfo?.addLink ? (
            <div className="obj-desc">
              <h3 className="step-sub-title">{convertText("documentLink")}</h3>
              <div className="obj-desc">
                <Form.Item
                  name="link"
                  rules={[
                    {
                      whitespace: true,
                      type: "url",
                      message: `${convertText("linkValidate")}`,
                    },
                    {
                      required: true,
                      message: `${convertText("documentLinkValidate")}`,
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder={convertText("documentLinkPlaceholder")}
                  />
                </Form.Item>
              </div>
            </div>
          ) : (
            <div className="obj-desc">
              <h3 className="step-sub-title">
                {convertText("selectDocument")}
              </h3>
              <Form.Item
                name="file"
                rules={[
                  {
                    required: true,
                    message: `${convertText("documentFileValidate")}`,
                  },
                ]}
              >
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>
                    {convertText("selectFile")}
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          )}

          <h3 className="step-sub-title">{convertText("documentTitle")}</h3>
          <div className="obj-desc">
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: `${convertText("documentTitleValidate")}`,
                },
                {
                  max: 60,
                  message: `${convertText("initiativeNameMaxLength")}`,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={convertText("documentTitlePlaceholder")}
                id="process-name"
              />
            </Form.Item>
          </div>

          <div className="obj-desc add-process-status-select-wrapper">
            <h3 className="step-sub-title">
              {convertText("documentPriority")}
            </h3>
            <Form.Item
              name="priority"
              rules={[
                {
                  required: true,
                  message: `${convertText("documentPriorityValidate")}`,
                },
              ]}
            >
              <Select
                className={selectedPriority}
                placeholder={convertText("documentPriorityPlaceHolder")}
                size="large"
                style={{ width: 140 }}
                getPopupContainer={(trigger) => trigger.parentElement}
                onChange={(value) => setSelectedPriority(value?.toLowerCase())}
                options={documentPriorityOptions}
              />
            </Form.Item>
          </div>

          <div className="obj-desc add-process-status-select-wrapper">
            <h3 className="step-sub-title">{convertText("documentStatus")}</h3>
            <Form.Item
              name="status"
              rules={[
                {
                  required: true,
                  message: `${convertText("documentStatusValidate")}`,
                },
              ]}
            >
              <Select
                className={`document-status-select ${selectedDocStatus}`}
                placeholder={convertText("documentStatusPlaceHolder")}
                size="large"
                style={{ width: 140 }}
                onChange={(value) => setSelectedDocStatus(value?.toLowerCase())}
                getPopupContainer={(trigger) => trigger.parentElement}
              >
                {documentStatusoptions?.map((option: DocumentOption) => (
                  <Option key={option?.value} value={option?.value}>
                    <span className={option?.value?.toLowerCase()}>
                      {option?.label}
                    </span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>
        <div className="ant-modal-footer">
          <Button key="back" className="self-btn" onClick={onCancelModal}>
            {convertText("cancelBtn")}
          </Button>
          <Button
            className="theme-btn"
            htmlType="submit"
            id="submit-add-task"
            disabled={formDisabled}
          >
            {convertText("addDocument")}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default React.memo(AddDocument);
AddDocument.defaultProps = {
  module: "",
};
