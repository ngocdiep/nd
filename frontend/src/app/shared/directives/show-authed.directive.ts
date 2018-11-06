import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from 'src/app/auth/shared/user.service';


@Directive({ selector: '[appShowAuthed]' })
export class ShowAuthedDirective implements OnInit {
    constructor(
        private templateRef: TemplateRef<any>,
        private authService: UserService,
        private viewContainer: ViewContainerRef
    ) { }

    condition: boolean;

    ngOnInit() {
        this.authService.isAuthenticated.subscribe(
            (isAuthenticated) => {
                if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
                    this.viewContainer.createEmbeddedView(this.templateRef);
                } else {
                    this.viewContainer.clear();
                }
            }
        );
    }

    @Input() set showAuthed(condition: boolean) {
        this.condition = condition;
    }
}
