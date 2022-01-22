import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { SharedModule } from '../shared/shared.module';
import { LoggingService } from '../logging.service';
import { StoreModule } from '@ngrx/store';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducers';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
    FormsModule,
    RouterModule.forChild([{ path: '', component: ShoppingListComponent }]),
    SharedModule,
    StoreModule.forFeature(
      'shoppingList',
      fromShoppingList.shoppingListReducer
    ),
  ],
  // providers: [LoggingService]
})
export class ShoppingListModule {}
