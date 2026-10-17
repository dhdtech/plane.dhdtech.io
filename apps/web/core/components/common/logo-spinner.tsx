/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { PlaneLogo } from "@plane/propel/icons";

export function LogoSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2">
        <PlaneLogo className="h-6 w-auto text-primary sm:h-11" />
        <span className="font-heading text-xl font-semibold tracking-tight text-primary sm:text-3xl">Plane</span>
      </div>
    </div>
  );
}
