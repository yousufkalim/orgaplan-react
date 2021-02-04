import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import GLOBALS from "../../../../globals";
import Form from "../../../../components/Form";
import Table from "../../../../components/Table";
import Button from "../../../../components/Button";
import SmallButton from "../../../../components/SmallButton";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: 15,
    marginTop: 10,
    width: "100%",
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function Profile(props) {
  const theme = useTheme();
  const classes = useStyles();

  const onSubmit = () => {
    console.log("onSubmit", {});
  };

  return (
    <Form.Form>
      <Form.Row justifyContent="flex-start">
        <Button
          maxWidth="30%"
          text="Create a Building"
          style={{ marginRight: 20 }}
          color={theme.palette.common.black}
        />
        <Button
          maxWidth="30%"
          text="Create a level"
          color={theme.palette.common.black}
        />
      </Form.Row>
      <div className={classes.content}>
        <Table
          headers={GLOBALS.Data.addSite.headings}
          rows={GLOBALS.Data.addSite.items.map((item) => [
            ...item,
            <Form.Row style={{ justifyContent: "center" }}>
              <SmallButton
                text="Archive"
                color={theme.palette.primary.contrastText}
                style={{
                  marginLeft: 10,
                  borderRadius: 4,
                }}
              />
            </Form.Row>,
          ])}
        />
      </div>
      <Form.ButtonContainer>
        <Button
          minWidth={200}
          text="COMPLETE"
          fullWidth={false}
          onClick={onSubmit}
        />
      </Form.ButtonContainer>
    </Form.Form>
  );
}
