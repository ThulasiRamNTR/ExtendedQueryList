///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: ExtendedQueryList
//      Issue: With QueryList
//      https://angular.io/api/core/QueryList#changes
//      Changes Observable Returns Observable of QueryList notifying the subscriber of changes.
//      So it makes it harder to identify the changes that actually got created or updated.
//      in ngOnChanges, we get SimpleChanges and SimpleChanges, whereas that is not the case here.
//
//      Ways that have been thought through to solve the issue:
//      1. We could blindly extend the QueryList , and add custom method to emit changes of newly added items alone.
//          However this approach has some downsides, such as need to override methods and the risk of breaking
//          changes in future versions of Angular.
//          Also note, QueryList class is final as per the official documentation as well.
//          https://angular.io/api/core/QueryList#querylist
//          So, it shouldn't be extended as well.
//          Even if we manage to extend, we need to compare objects state to find out the difference .
//          Such IterableDiffer and DefaultChangeDiffer classes are now outdated in Angular 14 as well.
//          And also, we couldn't inherit some custom class extended from two parent classes for it
//          (Multiple Inheritance is not supported natively in Angular, unless we use some Mixins approach
//          Ref: https://www.webtips.dev/solutions/extend-multiple-classes-in-typescript)
//
//      2. Final working approach:
//          Created a new class ExtendedQueryList internally powered by native QueryList
//
//          Native QueryList changes Observable only notifies us with the new QueryList changes.
//          So we have build this ExtendedQueryList, to notify us with ExtendedQueryListChanges 
//          Using the ExtendedQueryListChanges, we can easily identify the changes that got added in changeDetection
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { QueryList } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ExtendedQueryListChanges } from './ExtendedQueryListChanges';

export class ExtendedQueryList<T> 
{
    //#region Private properties
    /**
     * Cached query list items
     * Based on this, we will check the newly added query list items
     * During every new changes, the cache would be updated as well
     */
    private cacheItems: Array<any>;
    /**
     * Actual Query List
     */
    private _queryList: QueryList<any>;
    /**
     * Changes Subject for ExtendedQueryList that can be observed and listened to
     */
    private _changes: Subject<ExtendedQueryListChanges<any>> = new Subject<ExtendedQueryListChanges<any>>();
    //#endregion

    //#region Constructor
    /**
     * Constructor
     * @param queryList QueryList
     */
    constructor(queryList: QueryList<any>) 
    {
        this.cacheItems = queryList.toArray();
        this._queryList = queryList;
        this._queryList.changes.subscribe(() => this.emitChanges());
    }
    //#endregion

    //#region QueryList Implementations
    /**
     * Returns Observable of ExtendedQueryListChanges<BaseTileComponent> notifying the subscriber of changes.
     */
    get changes() : Observable<ExtendedQueryListChanges<any>>
    {
        return this._changes.asObservable();
    }
    /**
     * Helps to get the length of the ExtendedQueryList
     */
    get length() : number
    {
        return this._queryList.length;
    }
    /**
     * Helps to get the first ExtendedQueryList
     */
    get first() 
    {
        return this._queryList.first;
    }
    /**
     * Helps to get the last ExtendedQueryList
     */
    get last() 
    {
        return this._queryList.last;
    }
    /**
     * Helps to get the Array of ExtendedQueryList
     */
    get toArray() 
    {
        return this._queryList.toArray;
    }
    /**
     * Helps to get the forEach function reference of ExtendedQueryList
     * Similar to QueryList forEach , for this custom extended one
     * https://angular.io/api/core/QueryList#foreach
     */
    get forEach() 
    {
        return this._queryList.forEach;
    }
    /**
     * Helps to get the some function reference of ExtendedQueryList
     * Similar to QueryList some , for this custom extended one
     * https://angular.io/api/core/QueryList#some
     */
    get some() 
    {
        return this._queryList.some;
    }
    /**
     * Helps to get the some function reference of ExtendedQueryList
     * Similar to QueryList find , for this custom extended one
     * https://angular.io/api/core/QueryList#find
     */
    get find() 
    {
        return this._queryList.find;
    }
    /**
     * Helps to get the some function reference of ExtendedQueryList
     * Similar to QueryList filter , for this custom extended one
     * https://angular.io/api/core/QueryList#filter
     */
    get filter() 
    {
        return this._queryList.filter;
    }
    //#endregion

    //#region Custom Implementations
    /**
     * Helps to emit changes for the current extended QueryList implementation
     */
    private emitChanges() 
    {
        const newItems = this._queryList.filter((item) => !this.cacheItems.includes(item));
        if (newItems.length) 
        {
            const changes = new ExtendedQueryListChanges(this._queryList, newItems);
            this._changes.next(changes);
        }
        this.cacheItems = this._queryList.toArray();
    }
}