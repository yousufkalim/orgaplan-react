import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import FormInput from "../../../../components/FormInput";
import Heading from "../../../../components/Heading";

import Form from "../../../../components/Form";
import Button from "../../../../components/Button";

import FormMultipleUpload from "../../../../components/FormMultipleUpload";

import GLOBALS from "../../../../globals";

const useStyles = makeStyles((theme) => ({
    root: {
      padding: GLOBALS.Styles.pagePadding,
    },
    content: {
      padding: GLOBALS.Styles.pageContentPadding,
      marginTop: GLOBALS.Styles.pageContentMargin,
    },
}));

export default function UpdateStep(props) {
  const classes = useStyles();

  const [id, setId] = useState("");

  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");

  const [picture, setPicture] = useState("");

  const [uploadFile, setUploadFile] = useState([]);
  const [uniqueUploadFileId, setUniqueUploadFileId] = useState(Date.now());

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [props.step]);

  async function fetchData() {
    const datas = props.step

    datas._id && setId(datas._id);
    datas.text && setText(datas.text);
    datas.picture && setPicture(datas.picture);
  }

  const genericValidation = (value, setErrorCallback) => {
    setErrorCallback((value?.trim() === "") ? "Le champs est requis" : "")
  };

  const isValid = () => {
    return !!(!text || textError)
  }

  async function deleteStep(e) {
    e.preventDefault();
    props.deleteStep();
  }

  async function onSubmit(e) {
    e.preventDefault();

    var formdata = new FormData();

    if(!id) {
      formdata.append("text", text);
      if(uploadFile?.length > 0) {
          formdata.append("picture", uploadFile[0].file);
      } else {
          formdata.append("picture", null);
      }
  
      props.createStep(formdata);

    } else {

      formdata.append("_id", id);
      formdata.append("text", text);
      if(uploadFile?.length > 0) {
          formdata.append("picture", uploadFile[0].file);
      } else {
          formdata.append("picture", null);
      }

      setUploadFile([]);
      props.updateStep(formdata, id);
    }
  }

  return (
    <>
        <div>
            <Form.Row alignItems="flex-start" justifyContent="space-between">
                <Heading primary={`Etape ${props.number}`} />
            </Form.Row>
            <Form.Row>
            { picture ? (
                    <Form.Row>
                        <img
                            src={GLOBALS.Constants.BASE_URL + picture}
                            alt="stepImage"
                            width="75" height="75"
                            className={classes.image}
                        />
                    </Form.Row>
                ) : null}
                <FormMultipleUpload
                    name={`uploadFile_${uniqueUploadFileId}`}
                    values={uploadFile}
                    style={GLOBALS.Styles.inputWidth}
                    onChange={(value) => setUploadFile(value)}
                />
            </Form.Row>
            <Form.Row alignItems="flex-start">
                <FormInput
                    textArea
                    rows={3}
                    name="text"
                    value={text}
                    placeholder={"Texte"}
                    error={textError}
                    onChange={({ target: { value } }) => setText(value)}
                    onBlur={({ target: { value } }) => genericValidation(value, setTextError)}
                />
            </Form.Row>
            <Form.Row alignItems="flex-start">
                <Form.ButtonContainer>
                    <Button
                        minWidth={200}
                        text={"Enregistrer"}
                        fullWidth={false}
                        disabled={isValid()}
                        onClick={(e) => onSubmit(e)}
                        loading={props.loading}
                    />
                </Form.ButtonContainer>
                <Form.ButtonContainer>
                    <Button
                        minWidth={200}
                        text={"Supprimer"}
                        color="#c0392b"
                        fullWidth={false}
                        onClick={(e) => deleteStep(e)}
                        loading={props.loading}
                    />
                </Form.ButtonContainer>
            </Form.Row>
      </div>
    </>
  );
}
