export function GetOperationId(model: string, opetarion: string){
    const _model = ToTitleCase(model).replace(/\s/g, '');
    const _operation = ToTitleCase(opetarion).replace(/\s/g, '');

    return {
        title: '',
        opetarionId: `${_model}_${_operation}`
    }
}

function ToTitleCase(str: string): string {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.replace(work[0], word[0].toUpperCase()))
        .join(' ');
}
