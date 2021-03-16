import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import IconButton from "@material-ui/core/IconButton";

import GLOBALS from "../../globals";
import Actions from "../../redux/actions";

import Form from "../../components/Form";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import Heading from "../../components/Heading";
import SmallText from "../../components/SmallText";
import SubHeading from "../../components/SubHeading";
import OutlinedCapsuledButton from "../../components/OutlinedCapsuledButton";

import Logo from "../../assets/icons/Logo.svg";
import SiteImage from "../../assets/images/Site.png";
import { ReactComponent as Pencil } from "../../assets/icons/Pencil.svg";
import { ReactComponent as PlusCircle } from "../../assets/icons/PlusCircle.svg";

const useStyles = makeStyles((theme) => ({
  page: {
    height: "100vh",
  },
  root: {
    height: "100%",
    width: "calc(100% - 384px)",
    padding: GLOBALS.Styles.pagePaddingNormal,
    backgroundColor: theme.palette.common.white,
  },
  content: {
    overflow: "hidden",
    borderRadius: theme.shape.borderRadius,
    marginTop: GLOBALS.Styles.pageContentMargin,
    backgroundColor: theme.palette.secondary.main,
    padding: GLOBALS.Styles.pageContentNormalPadding,
  },
  // Header
  logo: {
    width: "126px",
    height: "121px",
  },
  // Sites
  sitesGrid: {
    display: "grid",
    gridGap: "30px",
    gridTemplateRows: "repeat(auto-fit, minmax(300px, 300px))",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 300px))",
  },
  image: {
    width: 260,
    height: 175,
    backgroundSize: "contain",
    borderRadius: theme.shape.borderRadius,
  },
  // Add Site Card
  addSiteCardImageContainer: {
    position: "relative",
  },
  addSiteCardImage: {
    width: 260,
    height: 175,
    opacity: 0.5,
    backgroundSize: "contain",
    borderRadius: theme.shape.borderRadius,
  },
  addSitePlusContainer: {
    zIndex: 10,
    width: "100%",
    height: "100%",
    display: "grid",
    position: "absolute",
    placeItems: "center",
  },
  addSitePlus: {
    width: "80%",
    height: "80%",
    color: theme.palette.grey[100],
  },
  // Profile Card
  profile: {
    width: 384,
    height: "100%",
    display: "grid",
    placeItems: "center",
    padding: GLOBALS.Styles.pagePaddingNormal,
    backgroundColor: theme.palette.secondary.main,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "100%",
    backgroundSize: "contain",
  },
  profileEditButton: {
    padding: 6,
    borderRadius: "100%",
    border: `1px solid ${theme.palette.grey[200]}`,
  },
}));

function generatePhone(phone) {
  var str = String(phone);
  str = "0" + str;
  var parts = str.match(/.{1,2}/g);
  var new_value = parts.join(".");
  return new_value;
}

function SiteCard({ site, role, onClick }) {
  const classes = useStyles();
  return (
    <Card onClick={onClick} padding="20px">
      <Form.Row noMargin justifyContent="center">
        <SmallText primary={site.name} bold noWrap />
      </Form.Row>
      <Form.Row>
        <img
          alt={`site:${site.name}`}
          className={classes.image}
          src={site.logo ? GLOBALS.Constants.BASE_URL + site.logo : SiteImage}
        />
      </Form.Row>
      <Form.Row justifyContent="center" noMargin>
        <SmallText primary={`Rôle: ${role}`} />
      </Form.Row>
    </Card>
  );
}

function SiteAddCard({ onClick }) {
  const classes = useStyles();
  return (
    <Card padding="20px" onClick={onClick}>
      <Form.Row noMargin justifyContent="center">
        <SmallText primary="Créer un nouveau projet" bold noWrap />
      </Form.Row>
      <Form.Row className={classes.addSiteCardImageContainer}>
        <img
          src={SiteImage}
          alt={`create-site`}
          className={classes.addSiteCardImage}
        />
        <div className={classes.addSitePlusContainer}>
          <PlusCircle className={classes.addSitePlus} />
        </div>
      </Form.Row>
      <Form.Row justifyContent="center" noMargin>
        <SmallText primary={""} />
      </Form.Row>
    </Card>
  );
}

function ProfileCard({ user, company, onClick, onPasswordChange, onLogout }) {
  const classes = useStyles();
  return (
    <Card disableHeight>
      <Form.Row justifyContent="flex-end" noMargin>
        <IconButton className={classes.profileEditButton} onClick={onClick}>
          <Pencil style={{ width: 20, height: 20 }} />
        </IconButton>
      </Form.Row>
      <Form.Row justifyContent="center" noMargin>
        <img
          alt="avatar"
          className={classes.avatar}
          src={user.image ? GLOBALS.Constants.BASE_URL + user.image : SiteImage}
        />
      </Form.Row>
      <Form.Row justifyContent="center">
        <SubHeading bold primary={`${user.firstName} ${user.lastName}`} />
      </Form.Row>
      <Form.Item />
      <Form.Column>
        <SmallText bold primary="ADRESSE E-MAIL :" noMargin />
        <SmallText primary={user.email} />
      </Form.Column>
      <Form.Column>
        <SmallText bold primary="TELEPHONE :" noMargin />
        <SmallText primary={generatePhone(user.phone)} />
      </Form.Column>
      <Form.Column>
        <SmallText bold primary="ENTREPRISE :" noMargin />
        <SmallText primary={company?.name} />
      </Form.Column>
      <Form.Row></Form.Row>
      <Form.Row justifyContent="center">
        <OutlinedCapsuledButton
          onClick={onPasswordChange}
          text="MODIFIER MON MOT DE PASSE"
        />
      </Form.Row>
      <Form.Row justifyContent="center">
        <OutlinedCapsuledButton text="ME DECONNECTER" onClick={onLogout} />
      </Form.Row>
    </Card>
  );
}

export default function Sites(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const store = useSelector((state) => state.auth);

  const [items, setItems] = useState([]);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  async function fetchData() {
    try {
      const result = await GLOBALS.API({
        uri: `${GLOBALS.Constants.GET_USER_SITES}/${store.user._id}`,
      });
      console.log(JSON.stringify(store.user.company, null, 2));
      const adminCompany = await GLOBALS.API({
        uri: `${GLOBALS.Constants.COMPANY_GET}/${store.user.company}`,
      });
      dispatch(Actions.admin.set_company(adminCompany.data));
      setCompany(adminCompany.data);
      setItems(result.data.sites);
      setLoading(false);
    } catch (err) {
      dispatch(
        Actions.notistack.enqueueSnackbar(
          Actions.notistack.snackbar(err.message, "error"),
        ),
      );
    }
  }

  return (
    <Form.Row className={classes.page} noMargin>
      <div className={classes.root}>
        <Form.Row
          margin="0 0 20px 0"
          alignItems="center"
          justifyContent="space-between"
        >
          <img src={Logo} alt="Orgaplan-Logo" className={classes.logo} />
          <SmallText primary="Go To Home Page" to="/" underline noMargin />
        </Form.Row>
        <Heading primary="BIENVENUE SUR ORGAPLAN ! " noWrap noMargin />
        <SmallText
          primary="Cliquez sur un projet existant ou bien créez un nouveau projet : "
          noWrap
        />
        <div className={classes.content}>
          {loading ? (
            <Loader.Progress />
          ) : (
            <div className={classes.sitesGrid}>
              {items.map((site) => (
                <SiteCard
                  role={site.role}
                  site={site.siteId}
                  key={site.siteId._id}
                  onClick={() => {
                    if (window.confirm("Are you sure?")) {
                      dispatch(Actions.admin.set_site(site));
                    } else
                      console.log(JSON.stringify(site.siteId._id, null, 2));
                  }}
                />
              ))}
              {company.type === "MASTERCLIENT" &&
                company.adminIds.some(
                  (admin) => admin._id === store.user._id,
                ) && <SiteAddCard onClick={() => console.log("asdf")} />}
            </div>
          )}
        </div>
      </div>
      <div className={classes.profile}>
        <ProfileCard
          user={store.user}
          company={company}
          onClick={() => console.log("onClick")}
          onLogout={() => dispatch(Actions.auth.do_logout())}
          onPasswordChange={() => console.log("onPasswordChange")}
        />
      </div>
    </Form.Row>
  );
}
