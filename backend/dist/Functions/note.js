"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNote = void 0;
function updateNote(autoEcole, reviewContent) {
    ((Number(autoEcole.note) * Number(autoEcole.noteCount)) + Number(reviewContent.stars)) / (Number(autoEcole.noteCount) + 1);
}
exports.updateNote = updateNote;
//# sourceMappingURL=note.js.map