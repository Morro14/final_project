import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";

export default function AddFormIndex() {
  const auth = useAuth()
  const t = auth.translate
  const { user } = useOutletContext().user;
  const userManager = user.groups.find((g) => g.name === "Manager");

  const addReferenceButton = (
    <Link
      className="button add-form-index-button"
      to={"/dashboard/create/reference"}
    >
      {t('reference')}
    </Link>
  );

  const addMachineButton = (
    <Link
      className="button add-form-index-button"
      to={"/dashboard/create/machine"}
    >
      {t('machine')}
    </Link>
  );

  const addReclamationButton = (
    <Link
      className="button add-form-index-button"
      to={"/dashboard/create/reclamation"}
    >
      {t('reclamation')}
    </Link>
  );

  return (
    <div className="add-form-index">
      <h2>{t('addData') + ':'}</h2>
      <div className="add-form-index-buttons">
        {userManager ? addMachineButton : ''}
        <Link
          className="button add-form-index-button"
          to={"/dashboard/create/maintenance"}
        >
          {t('maintenance')}
        </Link>
        {userManager || user.user_type === "service" ||
          user.user_type === "service_company" ? addReclamationButton : ''}
        {userManager ? addReferenceButton : ''}
      </div>
    </div>
  );
}
