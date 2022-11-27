import {ElementType} from "./Enum";
import {canSatisfyCostRequirement} from "./Util";

test('canSatisfyCostRequirement', () => {
  let rawDices = [ElementType.Pyro, ElementType.Pyro];
  expect(canSatisfyCostRequirement('BBP', rawDices)).toBe(false);

  rawDices = [ElementType.Hydro, ElementType.Pyro];
  expect(canSatisfyCostRequirement('PP', rawDices)).toBe(false);

  rawDices = [ElementType.Pyro, ElementType.Pyro];
  expect(canSatisfyCostRequirement('PP', rawDices)).toBe(true);

  rawDices = [ElementType.Pyro, ElementType.Omni];
  expect(canSatisfyCostRequirement('PP', rawDices)).toBe(true);

  rawDices = [ElementType.Omni, ElementType.Omni];
  expect(canSatisfyCostRequirement('PP', rawDices)).toBe(true);

  rawDices = [ElementType.Omni, ElementType.Omni];
  expect(canSatisfyCostRequirement('BB', rawDices)).toBe(true);

  rawDices = [ElementType.Pyro, ElementType.Pyro, ElementType.Dendro];
  expect(canSatisfyCostRequirement('BBP', rawDices)).toBe(true);
});
