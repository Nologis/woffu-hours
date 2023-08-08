import { Locator, Page } from '@playwright/test';

export const woffuURL = `${process.env.WOFFU_URL}/V2/login`;

export const exists = async (locator: Locator): Promise<boolean> => {
  try {
    return !!await locator.first();
  } catch (e) {
    return false;
  }
};

const woffuActions = (page: Page) => {
  const frameLocator = page.frameLocator('#woffu-legacy-app');
  return ({
    goToReport: async () => await page.goto(`${process.env.WOFFU_URL}/v2/personal/diary/user`),
    getDayToFill: async () => await frameLocator.locator('.ng-binding.ng-scope.text-danger').first(),
    countTotalDaysToFill: async page => {
      await page.waitForTimeout(5000);
      return await frameLocator.locator('.ng-binding.ng-scope.text-danger').getByText('-8h').count();
    },
    getModifyButton: async (): Promise<Locator | undefined> => {
      const modifyButton = await frameLocator.getByText('Modificar');
      if (await exists(modifyButton)) {
        return modifyButton;
      }
    },
    fillHours: async modifyButton => {
      await modifyButton.click();
      const acceptButton = { name: 'Aceptar' };

      await frameLocator.getByPlaceholder('09:00:00').click();
      await frameLocator.getByPlaceholder('09:00:00').fill('09:00');
      await frameLocator.getByPlaceholder('14:00:00').click();
      await frameLocator.getByPlaceholder('14:00:00').fill('14:00');
      await frameLocator.getByPlaceholder('15:00:00').click();
      await frameLocator.getByPlaceholder('15:00:00').fill('15:00');
      await frameLocator.getByPlaceholder('18:00:00').click();
      await frameLocator.getByPlaceholder('18:00:00').fill('18:00');

      await frameLocator.getByRole('button', acceptButton).click();
    },
    hasErrorFillingFutureDays: async () => {
      const totalWarnings = await frameLocator.getByText('Fichajes futuros no permitidos').count();
      return totalWarnings > 1;
    },
    close: async () => {
      const modalOnScreen = await frameLocator.locator('.modal-open #diary-edit.sticky .modal-dialog .modal-header button').count();
      if (modalOnScreen) {
        await frameLocator.locator('.modal-open #diary-edit.sticky .modal-dialog .modal-header button').click();
      }
    }
  });
};

export const dismissModal = async (page: Page) => {
  await page.locator('button:has-text("Dismiss modal")').click();
};

export const goToReport = async (page: Page) => {
  const { goToReport } = woffuActions(page);
  await goToReport();
};

export const fillHours = async (page: Page) => {
  const {
    getDayToFill,
    getModifyButton,
    countTotalDaysToFill,
    fillHours,
    close,
    hasErrorFillingFutureDays
  } = woffuActions(page);

  let canFillCurrentDay = true;
  let totalDaysToFill = await countTotalDaysToFill(page);
  while (totalDaysToFill > 1 && canFillCurrentDay) {
    const dayToFill = await getDayToFill();
    if (dayToFill) {
      dayToFill.click();

      const modifyButton = await getModifyButton();
      await fillHours(modifyButton);
      canFillCurrentDay = !Boolean(await hasErrorFillingFutureDays());
      // if(canFillCurrentDay) {
      await close();
      // }
    }

    if (totalDaysToFill === await countTotalDaysToFill(page)) {
      totalDaysToFill = 0;
    } else {
      totalDaysToFill = await countTotalDaysToFill(page);
    }
    console.log('while conditions', totalDaysToFill, canFillCurrentDay);
  }
};
