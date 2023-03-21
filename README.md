# ExtendedQueryList
Angular 14 QueryList extended functionalities implementation

 Native QueryList changes Observable only notifies us with the new QueryList changes.
	So I have build this ExtendedQueryList, to notify with ExtendedQueryListChanges 
	Using the ExtendedQueryListChanges, we can easily identify the changes that got added in changeDetection

This allows to perform any change detection related activities after quering any dom elements, if needed.
	Similar to the ngOnChanges lifeCycle hook SimpleChanges .

Given, it has the native QueryList methods as well overridden, with custom changes implementation.
This makes it more powerful to be used in any Angular 14 application with @ViewChild or @ViewChildren, etc.