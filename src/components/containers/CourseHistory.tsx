import { useEffect, useId, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
	buildTranscript,
	formatCourseGpa4,
	formatGpa12,
	formatGpa4,
	letterGrade,
	semesterLabel,
	yearLabel,
	type DisplayCourse,
	type GpaSummary,
} from '../../data/courses';
import AppModal from './AppModal';
import SimpleButton from '../buttons/SimpleButton';
import ToggleSwitch from '../buttons/ToggleSwitch';
import SlidingText from '../displays/SlidingText';
import '../../styles/course-history.css';

function formatSummary(summary: GpaSummary): string {
	const unitsLabel = `${summary.units} ${summary.units === 1 ? 'unit' : 'units'}`;
	if (summary.gpa12 == null || summary.gpa4 == null) return unitsLabel;
	return `${formatGpa12(summary.gpa12)} / 12 · ${formatGpa4(summary.gpa4)} / 4.0 · ${unitsLabel}`;
}

function courseMark(course: DisplayCourse): string {
	if (course.grade === 'MT' || course.grade === 'COM') return course.grade;
	return letterGrade(course.grade);
}

function CourseGrade({ course }: { course: DisplayCourse }) {
	if (course.grade === 'COM') {
		return (
			<>
				<span className="course-table__letter" data-label="Letter" role="cell">
					COM
				</span>
				<span className="course-table__g12" data-label="12-pt" role="cell">
					—
				</span>
				<span className="course-table__g4" data-label="4.0" role="cell">
					—
				</span>
				<span className="course-table__units" data-label="Units" role="cell">
					0
				</span>
			</>
		);
	}

	if (course.grade === 'MT') return null;

	return (
		<>
			<span className="course-table__letter" data-label="Letter" role="cell">
				{letterGrade(course.grade)}
			</span>
			<span className="course-table__g12" data-label="12-pt" role="cell">
				{course.grade}
			</span>
			<span className="course-table__g4" data-label="4.0" role="cell">
				{formatCourseGpa4(course.grade)}
			</span>
			<span className="course-table__units" data-label="Units" role="cell">
				{course.units}
			</span>
		</>
	);
}

export default function CourseHistory() {
	const [open, setOpen] = useState(false);
	const titleId = useId();
	const { pathname } = useLocation();
	const transcript = useMemo(() => buildTranscript(), []);

	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	if (!transcript.years.length) return null;

	return (
		<>
			<SimpleButton
				text="View courses"
				variant="ghost"
				onClick={() => setOpen(true)}
				ariaHasPopup="dialog"
			/>
			{open ? (
				<CourseHistoryModal
					titleId={titleId}
					transcript={transcript}
					onClose={() => setOpen(false)}
				/>
			) : null}
		</>
	);
}

function CourseHistoryModal({
	titleId,
	transcript,
	onClose,
}: {
	titleId: string;
	transcript: ReturnType<typeof buildTranscript>;
	onClose: () => void;
}) {
	const [details, setDetails] = useState(false);

	return (
		<AppModal
			titleId={titleId}
			eyebrow="Academic record"
			title="Course history"
			onClose={onClose}
			size="wide"
			action={
				<ToggleSwitch label="Details" checked={details} onChange={setDetails} />
			}
			afterHeader={
				<div className="course-table__head" role="row">
					<span role="columnheader">Prefix</span>
					<span role="columnheader">Code</span>
					<span role="columnheader">Name</span>
					<div className="course-table__grades">
						<span role="columnheader">Letter</span>
						<span role="columnheader">12-pt</span>
						<span role="columnheader">4.0</span>
						<span role="columnheader">Units</span>
					</div>
				</div>
			}
			footer={
				<div className="course-history__overall">
					<p className="course-history__overall-label">Cumulative</p>
					<p className="course-history__overall-values">
						{transcript.overall.gpa12 != null && transcript.overall.gpa4 != null ? (
							<>
								<strong>{formatGpa12(transcript.overall.gpa12)}</strong>
								<span> / 12</span>
								<span className="course-history__sep" aria-hidden="true">
									·
								</span>
								<strong>{formatGpa4(transcript.overall.gpa4)}</strong>
								<span> / 4.0</span>
								<span className="course-history__sep" aria-hidden="true">
									·
								</span>
								<span className="course-history__units">
									{transcript.overall.units}{' '}
									{transcript.overall.units === 1 ? 'unit' : 'units'}
								</span>
							</>
						) : (
							<span className="course-history__units">
								{transcript.overall.units}{' '}
								{transcript.overall.units === 1 ? 'unit' : 'units'}
							</span>
						)}
					</p>
				</div>
			}
		>
			<div
				className={`course-table${details ? ' is-detailed' : ''}`}
				role="table"
				aria-label="Courses by semester"
			>
				{transcript.years.map((year) => (
					<div key={year.startYear} className="course-table__year" role="rowgroup">
						<div className="course-table__banner" role="row">
							<span className="course-table__banner-title">{yearLabel(year)}</span>
							<span className="course-table__banner-avg">{formatSummary(year.summary)}</span>
						</div>

						{year.semesters.map((semester) => (
							<div
								key={`${year.startYear}-${semester.term}`}
								className="course-table__semester"
							>
								<div className="course-table__banner course-table__banner--term" role="row">
									<span className="course-table__banner-title">
										{semesterLabel(semester)}
									</span>
									<span className="course-table__banner-avg">
										{formatSummary(semester.summary)}
									</span>
								</div>

								{semester.courses.map((course, index) => {
									const isMultiTerm = course.grade === 'MT';
									return (
										<div
											key={`${course.prefix}-${course.code}-${index}`}
											className={`course-table__row${isMultiTerm ? ' course-table__row--mt' : ''}`}
											role="row"
										>
											<div className="course-table__id">
												<span className="course-table__prefix" role="cell">
													{course.prefix}
												</span>
												<span className="course-table__code" role="cell">
													{course.code}
												</span>
											</div>
											<SlidingText
												text={course.name}
												enabled={!details}
												className="course-table__name"
												role="cell"
											/>
											<span className="course-table__mark" role="cell">
												{courseMark(course)}
											</span>
											{isMultiTerm ? (
												<span className="course-table__status" role="cell">
													MT
												</span>
											) : (
												<div className="course-table__grades">
													<CourseGrade course={course} />
												</div>
											)}
										</div>
									);
								})}
							</div>
						))}
					</div>
				))}
			</div>
		</AppModal>
	);
}
