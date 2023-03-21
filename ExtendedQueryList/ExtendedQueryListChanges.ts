///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: ExtendedQueryListChanges
//
//      Native QueryList changes Observable only notifies us with the new QueryList changes.
//      So we have build this ExtendedQueryList, to notify us with ExtendedQueryListChanges 
//      Using the ExtendedQueryListChanges, we can easily identify the changes that got added in changeDetection
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { QueryList } from '@angular/core';

export class ExtendedQueryListChanges<T> 
{
    //#region Public properties
    public readonly added: T[] = [];
    //#endregion

    //#region Constructor
    /**
     * Constructor
     * @param queryList Query List
     * @param newItems New Items
     */
    constructor(public readonly queryList: QueryList<T>, public readonly newItems: T[]) 
    {
        newItems.forEach((item) => this.added.push(item));
    }
    //#endregion
}