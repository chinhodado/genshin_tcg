import {CardInGame} from "../App";
import {getElementDisplay, getSkillCostDisplay} from "../Util";
import {ElementType, WeaponType} from "../Enum";

type CardDetailPopupProps = {
  card: CardInGame
}

function CardDetailPopup(props: CardDetailPopupProps) {
  let imgPath = "img/cards/" + props.card.base.img + ".webp";
  let base = props.card.base;
  return (
    <div className="card-detail-popup">
      <img id="card-detail-img" src={imgPath} alt=""/>
      <table className="card-detail-popup-table">
        <tbody>
          <tr className="card-detail-name bold">
            <td colSpan={3}>{base.name}</td>
          </tr>
          <tr>
            <td>{getElementDisplay(base.element, ElementType[base.element])}</td>
            <td>{WeaponType[base.weapon]}</td>
          </tr>
          <tr>
            <td colSpan={3}>&nbsp;</td>
          </tr>
          <tr className="bold">
            <td>Normal</td>
            <td>{base.skills.normal.name}</td>
            <td>{getSkillCostDisplay(base.skills.normal.cost)}</td>
          </tr>
          <tr>
            <td colSpan={3}>{base.skills.normal.desc}</td>
          </tr>
          <tr>
            <td colSpan={3}>&nbsp;</td>
          </tr>
          <tr className="bold">
            <td>Skill</td>
            <td>{base.skills.skill.name}</td>
            <td>{getSkillCostDisplay(base.skills.skill.cost)}</td>
          </tr>
          <tr>
            <td colSpan={3}>{base.skills.skill.desc}</td>
          </tr>
          <tr>
            <td colSpan={3}>&nbsp;</td>
          </tr>
          <tr className="bold">
            <td>Burst</td>
            <td>{base.skills.burst.name}</td>
            <td>{getSkillCostDisplay(base.skills.burst.cost)} + ({base.skills.burst.energy}E)</td>
          </tr>
          <tr>
            <td colSpan={3}>{base.skills.burst.desc}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default CardDetailPopup;
